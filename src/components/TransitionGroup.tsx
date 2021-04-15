import { useState , useEffect , useRef} from 'react';
// import  usePrevious  from 'hook/usePrevious';
import { IconContext } from "react-icons";
import { BsArrowLeft , BsArrowRight } from "react-icons/bs";


interface IProps {
    images:Array<string>;
    removePic: (i: number) => void;
    [x: string]: any;
}

const TransitionGroup: React.FC<IProps> = (props) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const refCurrentIndex = useRef<number>(0);
    const isRemovePic  = useRef<boolean>(false);
    
    // 幻燈片長度 8是css中image的padding
    const viewWrapWidth = { width: (props.imageWidth + 8) * props.perPage + "px" };
    const pageIdReference = props.images.length - props.perPage;

    // 按鈕禁止狀態
    const prevButtonDisable = () => { return !currentIndex };
    const nextButtonDisable = () => { return props.images.length <= props.perPage || currentIndex >= pageIdReference };

    const currentIndexPlus = () => {
        nextButtonDisable() || setCurrentIndex(currentIndex+1);
    }
    const currentIndexMinus = () => {
        prevButtonDisable() || setCurrentIndex(currentIndex-1);
    }

    const handleRemovePic = (index: number) => {
        // -----處理css離場效果------
        const removeImg = document.getElementsByClassName('image')[index];
        removeImg.className = 'image image-leave-to';
        // ----------------------
        
        setTimeout(()=>{props.removePic(index)} , 300);
        refCurrentIndex.current = currentIndex === 0 ? 1 : currentIndex ;
        isRemovePic.current = true;
    }

    
    useEffect(() => { 
        if(isRemovePic.current){
            pageIdReference < 0 || setCurrentIndex(currentIndex => {
                return currentIndex === 0 ? 0 : currentIndex -1;
            });
            isRemovePic.current = false;
        }else{
            // -----處理css入場效果------
            const newImg = document.getElementsByClassName('image');
            !!!newImg.length || setTimeout(()=>{newImg[newImg.length -1].className = 'image'} , 300);
            // ----------------------
            
            const newIndex = pageIdReference > 0 ? pageIdReference : 0;
            setCurrentIndex(newIndex);

            refCurrentIndex.current = newIndex - 1;
        }
    }, 
    [pageIdReference] 
    );

    //bug要解決 -> 前三張如果刪除再新增圖片的話，第一次不會觸發css入場效果(前三張不會因setCurrentIndex而re-render)
    const ImageView = () => {
        // 移動畫面位置
        const movedDistance = () => { return {transform:`translateX(${currentIndex * -1 * (props.imageWidth + 8)}px)`}};
        if (props.images.length) {
            return <div className="image-list" style={ movedDistance() }>
                        {props.images.map((image: string | undefined,index:number) => {
                            const imgActive = currentIndex > refCurrentIndex.current  &&  props.images.length - 1 === index ? "image image-enter" : "image";
                            return <div key={index} className={imgActive}>
                                        <img src={image} alt="" />
                                        <ClearButton index={index} />
                                    </div>;
                        })}
                    </div>;
        }
        return <div className="no-image">尚未加入圖片</div>;
    }

    const ClearButton = (clearProp: any) => {
        return props.clear && <span className="image-remover" onClick={() => handleRemovePic(clearProp.index)}>
                                &times;
                              </span>
    }

    return (
        <div>
            <div className="image-list-wrap" style={ viewWrapWidth }>
                <ImageView />
            </div>
            <div className="image-buttons-block">
                <button
                    className={`image-prev ${prevButtonDisable() && 'disable'}`}
                    disabled={prevButtonDisable()}
                    onClick={(e)=> {e.preventDefault(); currentIndexMinus()}}
                >
                    <IconContext.Provider value={{size:"2em"}}>
                        <BsArrowLeft />
                    </IconContext.Provider>
                </button>

                <button
                    className={`image-next ${nextButtonDisable() && 'disable'}`}
                    disabled={nextButtonDisable()}
                    onClick={(e)=>{e.preventDefault(); currentIndexPlus()}}
                >
                    <IconContext.Provider value={{size:"2em"}}>
                        <BsArrowRight  />
                    </IconContext.Provider>
                </button>
            </div>
            <p className="image-desc">{currentIndex} / {props.images.length}</p>
        </div>
    );
}

export default TransitionGroup;