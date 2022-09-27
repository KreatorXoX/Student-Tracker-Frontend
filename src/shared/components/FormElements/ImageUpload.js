import React, { useRef, useState, useEffect } from "react";

import Button from "../FormElements/Button";

import styles from "./ImageUpload.module.css";
import formStyles from "./Input.module.css";

const ImageUpload = (props) => {
  const imageInput = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedImageHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInputChange(props.id, pickedFile, fileIsValid);
  };

  const imagePickerHandler = () => {
    imageInput.current.click();
  };
  return (
    <div className={formStyles["form-control"]}>
      <input
        ref={imageInput}
        onChange={pickedImageHandler}
        type="file"
        id={props.id}
        style={{ display: "none" }}
        accept="image/jpg, image/jpeg, image/png"
      />
      {!isValid && <p>{props.errorText}</p>}
      <div className={styles.imageUpload}>
        <div className={styles.imagePreview}>
          {previewUrl && <img src={previewUrl} alt={"preview"} />}
          {!previewUrl && (
            <p style={{ color: "black" }}>Please pick an image</p>
          )}
        </div>
        <Button type="button" onClick={imagePickerHandler}>
          Pick An Image
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
