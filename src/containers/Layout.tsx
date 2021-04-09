import {useState} from 'react';
import TransitionGroup from 'components/TransitionGroup';
import MaterialIcon from 'material-icons-react';

const Layout = () => {
  const [images, setImages] = useState<string[]>([]);
  const [imageWidth] = useState<number>(400);
  const [perPage] = useState<number>(3);
  const [clear] = useState<boolean>(true);

  const addPic = () => {
      // 借用類星體的萬用圖片:D 推廣: https://quasar.dev/start/quasar-cli
    let url = `https://placeimg.com/${imageWidth}/300/nature?t=` + Math.random();

    var imageDom = new Image();
    imageDom.onload = e => {
      setImages([...images,url]);
    };
    imageDom.src = url;
  }

    const removePic = (i: number) => {
      setImages([ ...images.slice(0, i), ...images.slice(i + 1) ]);
    }

    return (
    <div className="Layout">
      <header className="Layout-header">
        <h4>SlideShow</h4>
        <TransitionGroup images={images} imageWidth={imageWidth} perPage={perPage} clear={clear} removePic={removePic} />
        <button className="image-adder" onClick={(e) => { e.preventDefault(); addPic() }}>
          {/* <span className="material-icons">add_photo_alternate</span> */}
          <MaterialIcon icon="add_photo_alternate" />
        </button>
      </header>
    </div>
  );
}

export default Layout;
