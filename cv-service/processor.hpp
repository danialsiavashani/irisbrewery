#pragma once

#include <string>
#include <vector>
#include <opencv2/opencv.hpp>

// Parameters for the sketch effect
// Using a struct keeps the function signatures clean —
// instead of passing 4 separate ints, we pass one SketchParams
struct SketchParams {
    int blur_amount         = 5;
    int edge_threshold_low  = 50;
    int edge_threshold_high = 150;
    int line_thickness      = 1;
};

class ImageProcessor {
public:
    // Decode raw bytes (from HTTP request) into a cv::Mat
    cv::Mat decode(const std::string& data);

    // Encode a cv::Mat into PNG bytes (for HTTP response)
    std::vector<uchar> encode(const cv::Mat& img);

    // Effects — each is its own method, easy to add more later
    cv::Mat applySketch(const cv::Mat& input, const SketchParams& params);
    cv::Mat applyWatermark(const cv::Mat& input, const std::string& text = "IRIS BREWERY PREVIEW");

private:
    // Internal helpers used by the effects
    cv::Mat toGrayscale(const cv::Mat& input);
    cv::Mat gaussianBlur(const cv::Mat& input, int kernelSize);
    cv::Mat cannyEdges(const cv::Mat& input, int low, int high);
    cv::Mat dilateEdges(const cv::Mat& input, int thickness);
    cv::Mat invert(const cv::Mat& input);
};