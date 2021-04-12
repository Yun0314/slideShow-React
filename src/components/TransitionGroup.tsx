import { useState , useEffect , useRef} from 'react';
// import  usePrevious  from 'hook/usePrevious';
// import MaterialIcon from 'material-icons-react';


interface IProps {
    images:Array<string>;
    removePic: (i: number) => void;
    [x: string]: any;
}

const TransitionGroup: React.FC<IProps> = (props) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const isRemovePic  = useRef<boolean>(false);

    // 幻燈片長度 8是css中image的padding
    const viewWrapWidth = { width: (props.imageWidth + 8) * props.perPage + "px" };
    const pageIdReference = props.images.length - props.perPage;

    // 按鈕禁止狀態
    const prevButtonDisable = () =>{ return !currentIndex };
    const nextButtonDisable = () =>{ return props.images.length <= props.perPage || currentIndex >= pageIdReference };

    const currentIndexPlus = () => {
        nextButtonDisable() || setCurrentIndex(currentIndex+1);
    }
    const currentIndexMinus = () => {
        prevButtonDisable() || setCurrentIndex(currentIndex-1);
    }

    const handleRemovePic = (index: number) => {
        props.removePic(index);
        isRemovePic.current = true;
    }

    useEffect(() => { 
        if(isRemovePic.current){
            pageIdReference < 0 || setCurrentIndex(currentIndex => {
                return currentIndex === 0 ? 0 :currentIndex -1;
            });
            isRemovePic.current = false;
        }else{
            const newIndex = pageIdReference > 0 ? pageIdReference : 0;
            setCurrentIndex(newIndex);
        }
    }, 
    [pageIdReference] 
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