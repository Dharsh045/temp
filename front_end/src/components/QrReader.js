import { useEffect, useRef, useState } from "react";
import "../Styles/QrStyles.css";
import QrScanner from "qr-scanner";

const QrReader = ({ onScan }) => {
    const scanner = useRef(null);
    const videoEl = useRef(null);
    const [qrOn, setQrOn] = useState(true);

    useEffect(() => {
        if (videoEl.current && !scanner.current) {
            scanner.current = new QrScanner(videoEl.current, (result) => {
                console.log("QR Code Detected:", result.data); // Debugging log
                onScan(result.data); // Send scanned data to parent component
            }, {
                onDecodeError: (err) => console.error("QR Scan Error:", err),
                preferredCamera: "environment",
                highlightScanRegion: true,
                highlightCodeOutline: true,
            });

            scanner.current.start()
                .then(() => setQrOn(true))
                .catch((err) => {
                    setQrOn(false);
                    console.error("Camera Access Error:", err);
                });
        }

        return () => {
            if (scanner.current) {
                scanner.current.stop();
                scanner.current.destroy();
                scanner.current = null;
            }
        };
    }, []);

    return (
        <div className="qr-reader-container">
            <div className="qr-reader">
                <video ref={videoEl} style={{ width: "100%", height: "100%" }}></video>
            </div>
        </div>
    );
};

export default QrReader;