#include <iostream>
#include "httplib.h"
#include "processor.hpp"

int main() {
    httplib::Server svr;
    ImageProcessor processor;

    svr.Get("/health", [](const httplib::Request&, httplib::Response& res) {
        res.set_content("ok", "text/plain");
    });

    svr.Post("/process", [&processor](const httplib::Request& req, httplib::Response& res) {
        // Extract image from multipart form data
        auto file = req.form.get_file("image");
        if (file.filename.empty()) {
            res.status = 400;
            res.set_content("No image provided", "text/plain");
            return;
        }

        // Parse CV parameters with safe defaults
        // std::stoi converts string to int — we guard with has_param first
        SketchParams params;
        if (req.has_param("blur_amount"))
            params.blur_amount = std::stoi(req.get_param_value("blur_amount"));
        if (req.has_param("edge_threshold_low"))
            params.edge_threshold_low = std::stoi(req.get_param_value("edge_threshold_low"));
        if (req.has_param("edge_threshold_high"))
            params.edge_threshold_high = std::stoi(req.get_param_value("edge_threshold_high"));
        if (req.has_param("line_thickness"))
            params.line_thickness = std::stoi(req.get_param_value("line_thickness"));

        // Decode image bytes into cv::Mat
        cv::Mat input = processor.decode(file.content);
        if (input.empty()) {
            res.status = 400;
            res.set_content("Failed to decode image", "text/plain");
            return;
        }

        // Run the sketch pipeline
        cv::Mat result = processor.applySketch(input, params);

        // Encode result as PNG and send back
        std::vector<uchar> encoded = processor.encode(result);
        res.set_content(
            reinterpret_cast<const char*>(encoded.data()),
            encoded.size(),
            "image/png"
        );
    });

    std::cout << "cv-service listening on port 8001" << std::endl;
    svr.listen("0.0.0.0", 8001);

    return 0;
}