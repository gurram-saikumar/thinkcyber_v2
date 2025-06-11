import React, { FC } from "react";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
  return (
    <div style={{position:"relative",paddingTop:"56.25%",overflow:"hidden"}}>
      {videoUrl && (
        <video
          controls
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0
          }}
          src={videoUrl}
          className="w-full h-full"
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default CoursePlayer;
