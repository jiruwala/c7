package com.example.weightreader;


public class SerialReader {

    public static void main(String[] args) {
        PortReader rd = new PortReader("settings.ini");

        // if (System.getProperty("os.name").toLowerCase().contains("win")) {
        // portName = "COM3"; // Windows
        // } else {
        // portName = "/dev/tty.usbserial-110"; // Mac
        // }

    }

}
