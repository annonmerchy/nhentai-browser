import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {getBookById} from "../actions/index";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import ImageLoader from "../components/image-loader";

class GalleryReader extends Component{
    constructor(props){
        super(props);

        this.computeImageUrl = this.computeImageUrl.bind(this);
        this.computePageLink = this.computePageLink.bind(this);
        this.preloadImage = this.preloadImage.bind(this);
        this.preloadArr = []; // the preload image queue
    }

    componentWillMount(){
        // if no data in state , go fetch data by id
        // if there's data remains , set it to the state
        if(!this.props.location.state){
            this.props.getBookById(this.props.match.params.id);
        } else{
            this.setState({
                images:this.props.location.state.images,
                page:this.props.match.params.page,
                media_id:this.props.location.state.media_id
            });
        }
        // back path setting
        try{
            const backpath = this.props.location.state.backpath;
            this.setState({backpath});
        }catch(e){
            this.setState({backpath:"/"});
        }
    }

    componentWillReceiveProps(nextProps){
        // state setting while receive props from actions
        this.setState({
            images:nextProps.images,
            page:nextProps.match.params.page,
            media_id:nextProps.media_id
        });
    }

    computeImageUrl(){
        // make the image src url to show it 
        const page = this.state.page;
        const image_type = {j:"jpg",p:"png",g:"gif"};
        const this_type = this.state.images[page-1].t;

        return `https://i.nhentai.net/galleries/${this.state.media_id}/${this.state.page}.${image_type[this_type]}`;
    }

    computePageLink(page){
        // make the url of back path
        const gallery_length = this.state.images.length;
        if(page<1 || page>gallery_length){
            return `/g/${this.props.id}`;
        }else{
            return `/g/${this.props.id}/${page}`;
        }
    }

    preloadImage(){
        // image preloading function
        // up to 3 images
        this.preloadArr.pop();
        const current_page = parseInt(this.state.page); // the page user at
        
        let page = parseInt(this.state.page) + this.preloadArr.length + 1; // page to preload
        while(page<=this.state.images.length && this.preloadArr.length<3){
            
            const image_type = {j:"jpg",p:"png",g:"gif"};
            const this_type = this.state.images[page-1].t;

            let image = new Image();
            image.src = `https://i.nhentai.net/galleries/${this.state.media_id}/${page}.${image_type[this_type]}`;
            this.preloadArr.unshift(image);
            page = current_page + this.preloadArr.length + 1;
        }
    }

    render(){
        // show a loading text while fetching data
        if(!this.state.images){
            return (
                <p>
                    Loading...
                </p>
            );
        }
        return (
            <div>
                <Link to={{pathname:`/g/${this.props.id}`,state:{backpath:this.state.backpath}}}>
                    <button className="Back-btn">&larr;</button>
                </Link>
                <p className="reader-img-counter">{this.state.page} / {this.state.images.length}</p>
                <div className="reader-img-container">
                    <Link to={{pathname:this.computePageLink(parseInt(this.state.page)-1),backpath:this.state.backpath}}>
                        <div className="reader-img-left" />
                    </Link>
                    <Link to={{pathname:this.computePageLink(parseInt(this.state.page)+1),backpath:this.state.backpath}}>
                        <div className="reader-img-right" />
                    </Link>
                    <ImageLoader src={this.computeImageUrl()} onLoad={this.preloadImage}/>
                </div>
                <p className="reader-img-counter">{this.state.page} / {this.state.images.length}</p>
            </div>
        );
    }
}

function mapStateToProps({book}){
    if(!book.images){
        return {images:[]};
    }
    const images = book.images.pages || [];
    return {images,media_id:book.media_id,id:book.id};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({getBookById},dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(GalleryReader);