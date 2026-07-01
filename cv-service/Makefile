CXX = g++
CXXFLAGS = -std=c++17 -O2 $(shell pkg-config --cflags opencv4)
LDFLAGS = $(shell pkg-config --libs opencv4)

TARGET = cv-service
SRC = main.cpp processor.cpp

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRC) $(LDFLAGS)

clean:
	rm -f $(TARGET)