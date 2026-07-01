#include "processor.hpp"

// ─── Decode / Encode ────────────────────────────────────────────────────────

cv::Mat ImageProcessor::decode(const std::string& data) {
    // Convert raw bytes to a vector of unsigned chars
    // uchar is OpenCV's typedef for unsigned char (0-255, one byte per value)
    std::vector<uchar> buf(data.begin(), data.end());

    // imdecode reads an image from memory rather than from a file path
    // IMREAD_COLOR loads as 3-channel BGR (OpenCV's native color order)
    return cv::imdecode(buf, cv::IMREAD_COLOR);
}

std::vector<uchar> ImageProcessor::encode(const cv::Mat& img) {
    std::vector<uchar> buf;
    // imencode compresses the Mat into PNG format in memory
    // The ".png" string tells OpenCV which format to use
    cv::imencode(".png", img, buf);
    return buf;
}

// ─── Private helpers ────────────────────────────────────────────────────────

cv::Mat ImageProcessor::toGrayscale(const cv::Mat& input) {
    cv::Mat gray;
    // COLOR_BGR2GRAY converts 3-channel BGR to 1-channel grayscale
    // Each pixel goes from (B,G,R) to a single intensity value
    cv::cvtColor(input, gray, cv::COLOR_BGR2GRAY);
    return gray;
}

cv::Mat ImageProcessor::gaussianBlur(const cv::Mat& input, int kernelSize) {
    cv::Mat blurred;
    // Gaussian blur smooths the image by averaging pixels with their neighbors
    // weighted by a Gaussian (bell curve) distribution
    // kernelSize must be odd — we enforce this with blurAmount*2+1 in applySketch
    // The last 0 tells OpenCV to calculate sigma automatically from kernel size
    cv::GaussianBlur(input, blurred, cv::Size(kernelSize, kernelSize), 0);
    return blurred;
}

cv::Mat ImageProcessor::cannyEdges(const cv::Mat& input, int low, int high) {
    cv::Mat edges;
    // Canny finds edges by detecting rapid intensity changes
    // low/high are hysteresis thresholds:
    //   — pixels above high: definitely an edge
    //   — pixels below low: definitely not an edge
    //   — pixels between: only an edge if connected to a strong edge
    // This two-threshold approach reduces noise while keeping real edges
    cv::Canny(input, edges, low, high);
    return edges;
}

cv::Mat ImageProcessor::dilateEdges(const cv::Mat& input, int thickness) {
    cv::Mat dilated;
    // Dilation expands bright regions — since edges are white on black,
    // this makes detected lines thicker and more visible
    // MORPH_RECT uses a rectangular structuring element of size thickness x thickness
    cv::Mat kernel = cv::getStructuringElement(
        cv::MORPH_RECT,
        cv::Size(thickness, thickness)
    );
    cv::dilate(input, dilated, kernel);
    return dilated;
}

cv::Mat ImageProcessor::invert(const cv::Mat& input) {
    cv::Mat result;
    // bitwise_not flips every bit: white (255) becomes black (0) and vice versa
    // This gives us dark lines on white background — the pencil sketch look
    cv::bitwise_not(input, result);
    return result;
}

// ─── Effects ────────────────────────────────────────────────────────────────

cv::Mat ImageProcessor::applySketch(const cv::Mat& input, const SketchParams& params) {
    // Chain the private helpers together to form the full pipeline
    // Each step takes the output of the previous step as input
    cv::Mat gray    = toGrayscale(input);
    cv::Mat blurred = gaussianBlur(gray, params.blur_amount * 2 + 1);
    cv::Mat edges   = cannyEdges(blurred, params.edge_threshold_low, params.edge_threshold_high);
    cv::Mat dilated = dilateEdges(edges, params.line_thickness);
    cv::Mat result  = invert(dilated);
    return result;
}

cv::Mat ImageProcessor::applyWatermark(const cv::Mat& input, const std::string& text) {
    // Clone the input so we don't modify the original
    // clone() does a deep copy — important because Mat normally uses reference counting
    cv::Mat result = input.clone();

    // Convert to BGR if grayscale — putText needs a color image to draw colored text
    // The sketch output is grayscale (1 channel), so we need to convert first
    if (result.channels() == 1) {
        cv::cvtColor(result, result, cv::COLOR_GRAY2BGR);
    }

    // Watermark settings
    int fontFace    = cv::FONT_HERSHEY_SIMPLEX;
    double fontScale = std::min(result.cols, result.rows) / 800.0;
    int thickness   = std::max(3, (int)(fontScale * 3));
    cv::Scalar color(0, 0, 0); // Pure black

    // Get text size so we can center it
    int baseline = 0;
    cv::Size textSize = cv::getTextSize(text, fontFace, fontScale, thickness, &baseline);

    // Draw the watermark diagonally across the image
    // We stamp it 3 times at different positions for better coverage
    std::vector<cv::Point> positions = {
        cv::Point(result.cols / 2 - textSize.width / 2, result.rows / 3),
        cv::Point(result.cols / 2 - textSize.width / 2, result.rows / 2),
        cv::Point(result.cols / 2 - textSize.width / 2, result.rows * 2 / 3),
    };

    for (const auto& pos : positions) {
        // Draw a dark shadow first for readability on both light and dark backgrounds
        cv::putText(result, text, cv::Point(pos.x + 2, pos.y + 2),
                    fontFace, fontScale, cv::Scalar(120, 120, 120), thickness + 1, cv::LINE_AA);
        // Then draw the light gray text on top
        cv::putText(result, text, pos,
                    fontFace, fontScale, color, thickness, cv::LINE_AA);
    }

    return result;
}