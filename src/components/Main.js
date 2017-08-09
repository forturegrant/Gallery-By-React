require('normalize.css/normalize.css');
require('styles/App.scss');
var imgDatas = require('../data/img.json');

import React from 'react';
import ReactDOM from 'react-dom';

imgDatas = (function getImageURL(imgDatasArr) {
	for(var i = 0; i < imgDatas.length; i++) {
		var singleImageData = imgDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.filename);
		imgDatasArr[i] = singleImageData;
	}
	return imgDatasArr;
})(imgDatas);

var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);
var getRangeAngle = () => {
	let deg = '';
	deg = (Math.random() > 0.5) ? '+' : '-';
	return deg + Math.ceil(Math.random() * 30);
}

class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	//  图片点击切换
	handleClick(e) {
		if(this.props.arrange.isCenter) {
			this.props.inverse()
		} else {
			this.props.center()
		}
		e.stopPropagation();
		e.preventDefault();
	}
	render() {
		var styleObj = {};
		if(this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		if(this.props.arrange.rotate) {
			(['Moz', 'Ms', 'Webkit', '']).forEach((value) => {
				styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			})
		}
		if(this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		let imgFigureClassName = 'figures';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';

		return(
			<div className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
		<img src={this.props.data.imageURL} />
        <div className="figure-title"><h2>{this.props.data.title}</h2>
        <div className="figure-back" onClick={this.handleClick} ><p>{this.props.data.title}</p>
        </div>
        </div>
        </div>
		)
	}
}
class AppComponent extends React.Component {
	constructor(props) {
		super(props);
		this.Constant = {
			centerPos: {
				left: 0,
				right: 0
			},
			hPosRange: { //水平方向的取值范围
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: { //垂直方向
				x: [0, 0],
				topY: [0, 0]
			}
		};
		this.state = {
			imgsArrangeArr: [{
				pos: {
					left: '0',
					top: '0'
				},
				rotate: 0,
				isInverse: false,
				isCenter: false
			}]
		}
	}

	//  图片点击切换
	inverse(index) {
		return() => {
			let imgsArrangArr = this.state.imgsArrangeArr;
			imgsArrangArr[index].isInverse = !imgsArrangArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangArr
			})
		}
	}
	rearrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			imgsArrangTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
			topImgSpiceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
		//首先居中centerIndex图片 ,centerIndex图片不需要旋转
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}
		//取出要布局上测的图片的状态信息
		topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);
		//布局位于上侧的图片
		imgsArrangTopArr.forEach((value, index) => {
			imgsArrangTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: getRangeAngle()
			};
		});

		//布局左两侧的图片
		for(let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			let hPosRangeLORX = null;

			//前半部分布局左边,右边部分布局右边
			if(i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX
			}
			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: getRangeAngle()
			};
		}
		if(imgsArrangTopArr && imgsArrangTopArr[0]) {
			imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
		}
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
	}

	/*利用rearramhe函数
	 *居中对应index的图片
	 *
	 */
	center(index) {
		return() => {
			this.rearrange(index);
		}
	}
	componentDidMount() {
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			stageHalfW = Math.ceil(stageW / 2),
			stageHalfH = Math.ceil(stageH / 2);
		var imgDOM = ReactDOM.findDOMNode(this.refs.imgfigure0),
			imgW = imgDOM.scrollWidth,
			imgH = imgDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		this.Constant.centerPos = {
			left: stageHalfW - halfImgW,
			top: stageHalfH - halfImgH
		};

		//左右侧位置的图片分布
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = stageHalfW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = stageHalfW + halfImgW;
		this.Constant.hPosRange.rightSecX[0] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		//上下侧位置的图片分布
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = -stageHalfH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = -halfImgW - imgW;
		this.Constant.vPosRange.x[1] = -halfImgW;
		let num = Math.floor(Math.random() * 16);
		this.rearrange(num);
	}
	render() {
		var ImgFigureArr = [];
		imgDatas.forEach((item, index) => {
			if(!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}
			ImgFigureArr.push(<ImgFigure data={item} ref = {'imgfigure' + index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)} />);
		})
		return(
			<div className="stage" ref='stage'>
		<div className="figures-sec">{ImgFigureArr}</div>
		</div>
		)
	}
}
AppComponent.defaultProps = {};

export default AppComponent;