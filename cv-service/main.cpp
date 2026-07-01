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

        // Parse CV parameters from form fields with safe defaults
        SketchParams params;

        auto blurIt = req.form.fields.find("blur_amount");
        if (blurIt != req.form.fields.end())
            params.blur_amount = std::stoi(blurIt->second.content);

        auto edgeLowIt = req.form.fields.find("edge_threshold_low");
        if (edgeLowIt != req.form.fields.end())
            params.edge_threshold_low = std::stoi(edgeLowIt->second.content);

        auto edgeHighIt = req.form.fields.find("edge_threshold_high");
        if (edgeHighIt != req.form.fields.end())
            params.edge_threshold_high = std::stoi(edgeHighIt->second.content);

        auto thicknessIt = req.form.fields.find("line_thickness");
        if (thicknessIt != req.form.fields.end())
            params.line_thickness = std::stoi(thicknessIt->second.content);

        // Debug — remove after testing
        std::cout << "blur=" << params.blur_amount
                  << " edgeLow=" << params.edge_threshold_low
                  << " edgeHigh=" << params.edge_threshold_high
                  << " thickness=" << params.line_thickness << std::endl;

        // Check if this is a preview request
        bool preview = false;
        auto it = req.form.fields.find("preview");
        if (it != req.form.fields.end()) {
            preview = it->second.content == "true";
        }
        std::cout << "preview param: " << (preview ? "true" : "false") << std::endl;

        // Decode image bytes into cv::Mat
        cv::Mat input = processor.decode(file.content);
        if (input.empty()) {
            res.status = 400;
            res.set_content("Failed to decode image", "text/plain");
            return;
        }

        // Run the sketch pipeline
        cv::Mat result = processor.applySketch(input, params);

        // Apply watermark if this is a preview
        if (preview) {
            result = processor.applyWatermark(result);
        }

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