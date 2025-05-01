import React from "react";

interface CustomModalProps {
    width?: string;
    height?: string;
    backgroundColor?: string;
    fontColor?: string;
    children?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
    width = "400px",
    height = "200px",
    backgroundColor = "#fff",
    fontColor = "#000",
    children,
}) => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999,
            }}
        >
            <div
                style={{
                    width,
                    height,
                    backgroundColor,
                    color: fontColor,
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div>{children}</div>
            </div>
        </div>
    );
};

export default CustomModal;
