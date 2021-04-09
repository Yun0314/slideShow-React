import { useState , useEffect} from 'react';
import  usePrevious  from 'hook/usePrevious';
// import MaterialIcon from 'material-icons-react';

const TransitionGroup = (props: any) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // 幻燈片長度 8是css中image的padding
    const viewWrapWidth = { width: (props.imageWidth + 8) * props.perPage + "px" };
    const pageIdReference = () => { return props.images.length - props.perPage };
    // 儲存 pageIdReference 前一個值
    const prevPageIdReference = usePrevious(pageIdReference());
    // 儲存 props.images.length 前一個值
    const prevImagesLength = usePrevious(props.images.length);
    // 按鈕禁止狀態
    const prevButtonDisable = () =>{ return !currentIndex };
    const nextButtonDisable = () =>{ return props.images.length <= props.perPage || currentIndex >= pageIdReference()};
    
    const currentIndexPlus = () => {
        nextButtonDisable() || setCurrentIndex(currentIndex+1);
    }
    const currentIndexMinus = () => {
        prevButtonDisable() || setCurrentIndex(currentIndex-1);
    }

    useEffect(() => { 
        props.images.length > prevImagesLength ? currentIndexPlus() : currentIndexMinus();

        //新增時到新圖片的定點
        if(prevPageIdReference < pageIdReference() && !nextButtonDisable()){
            setCurrentIndex(pageIdReference());
        }
    }, 
    [props.images] 
    );

    const ImageView = () => {
        // 移動畫面位置
        const movedDistance = () => { return {transform:`translateX(${currentIndex * -1 * (props.imageWidth + 8)}px)`}};
        
        if (props.images.length) {
            return <div className="image-list" style={ movedDistance() }>
                        {props.images.map((image: string | undefined,index:number) => {
                            return <div key={index} className="image">
                                        <img src={image} alt=""  />
                                        <ClearButton index={index} />
                                    </div>;
                        })}
                    </div>;
        }
        return <div className="no-image">尚未加入圖片</div>;
    }

    const ClearButton = (clearProp: any) => {
        return props.clear && <span className="image-remover" onClick={() => props.removePic(clearProp.index)}>
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
                    <span className="material-icons">arrow_back</span>
                    {/* <MaterialIcon icon="arrow_back" /> */}
                </button>

                <button
                    className={`image-next ${nextButtonDisable() && 'disable'}`}
                    disabled={nextButtonDisable()}
                    onClick={(e)=>{e.preventDefault(); currentIndexPlus()}}
                >
                    <span className="material-icons">arrow_forward</span>
                    {/* <MaterialIcon icon="arrow_forward" /> */}
                </button>
            </div>
            <p className="image-desc">{currentIndex} / {props.images.length}</p>
        </div>
    );
}

export default TransitionGroup;