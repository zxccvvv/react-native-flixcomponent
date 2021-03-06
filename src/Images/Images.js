// import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ActivityIndicator, Dimensions, Image, View } from "react-native";
import { WaterDrop } from "../index";

const window = Dimensions.get("window");

const RenderWithLoading = ({
  children,
  isLoading,
  width,
  height,
  ...props
}) => {
  const LoadingIndicator = () => {
    if (props.loadingWaterDrop) return <WaterDrop />;
    else return <ActivityIndicator size={"large"} color="orangered" />;
  };

  if (isLoading) {
    return (
      <View
        style={[
          {
            width,
            height,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ccc",
          },
          props.style,
        ]}
      >
        <LoadingIndicator />
      </View>
    );
  } else return children;
};

/**
 * @author [Flix](https://github.com/zxccvvv)
 *
 * @param {Object} props
 * @param {number} props.width - set `Width` of image
 * @param {number} props.height - set `Height` of image
 * @param {boolean} props.loadingWaterDrop - replace `ActivityIndicator` with `WaterDrop` when loading image
 */
const Images = (props) => {
  const [width, setWidth] = useState(props.width);
  const [height, setHeight] = useState(props.height);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [source, setSource] = useState(props.source);

  const tempPropsWidth = useRef(props.width).current;
  const tempPropsHeight = useRef(props.height).current;

  const SetSize = (size) => {
    if (props.width && !props.height)
      setHeight(size.height * (props.width / size.width));
    else if (!props.width && props.height)
      setWidth(size.width * (props.height / size.height));
    else {
      setWidth(window.width);
      setHeight(size.height * (window.width / size.width));
    }
    setIsLoading(false);
  };

  const InitImage = () => {
    let isSourceURL = typeof source === "string";
    if (isSourceURL) {
      Image.getSize(
        source,
        (width, height) => SetSize({ width, height }),
        (err) => {
          console.error(err);
          setIsError(true);
          setIsLoading(false);
        }
      );
    } else {
      const detailSource = Image.resolveAssetSource(
        source || require("./errorImage.png")
      );
      SetSize(detailSource);
    }
  };

  useEffect(() => {
    InitImage();
  }, [source]);

  useEffect(() => {
    if (props.width && width !== props.width) {
      setWidth(props.width);
      InitImage();
    } else if (props.height && height !== props.height) {
      setHeight(props.height);
      InitImage();
    } else if (props.width && props.height) {
      throw new Error(
        "Cannot set width and height, you can only use one of them, and put the rest inside style"
      );
    }
  });

  useEffect(() => {
    if (isError) {
      setSource(require("./errorImage.png"));
    }
  }, [isError]);

  useEffect(() => {
    if (tempPropsWidth !== props.width || tempPropsHeight !== height)
      InitImage();
  }, [props.width, props.height]);

  if (props.children)
    return (
      <RenderWithLoading isLoading={isLoading} {...props}>
        <Image
          source={typeof source === "string" ? { uri: source } : source}
          {...props}
          style={[{ width, height }, props.style]}
          imageStyle={[{ width, height }, props.imageStyle]}
        >
          {props.children}
        </Image>
      </RenderWithLoading>
    );
  else {
    return (
      <RenderWithLoading
        isLoading={isLoading}
        {...props}
        width={width}
        height={height}
      >
        <Image
          source={typeof source === "string" ? { uri: source } : source}
          style={[{ width, height }, props.style]}
          {...props}
        />
      </RenderWithLoading>
    );
  }
};

const ImageProps = {
  /** set `Width` of image */
  width: PropTypes.number,
  /** set `Height` of image */
  height: PropTypes.number,
  /** replace `ActivityIndicator` with `WaterDrop` when loading image */
  loadingWaterDrop: PropTypes.bool,
};

const ImageDefaultProps = {
  loadingWaterDrop: false,
};

Images.propTypes = ImageProps;
Images.defaultProps = ImageDefaultProps;

export default Images;
