package com.example.weightreader;

import java.io.BufferedReader;
import java.io.FileReader;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Scanner;

import com.fazecast.jSerialComm.SerialPort;

public class PortReader {
    private double lastKg = -1;
    private String portName = "COM3";
    private Map<String, Object> mapVars = new HashMap<String, Object>();
    SerialPort port = null;
    String server_url = "http://localhost:8080/";
    String weightcode = "1";

    private void readIniFile(String filename) throws Exception {
        Scanner s = new Scanner(new BufferedReader(new FileReader(filename)));
        Scanner ss = null;
        String var = "", val = "";
        while (s.hasNextLine()) {
            String a = s.nextLine();
            ss = new Scanner(a).useDelimiter("\\s*=\\s*");
            var = ss.next();
            val = ss.next();
            mapVars.put(var, val);
        }
        s.close();
        if (mapVars.get("port") != null)
            portName = mapVars.get("port").toString().trim();
        if (mapVars.get("server") != null)
            server_url = mapVars.get("server").toString().trim();
        if (mapVars.get("weightcode") != null)
            weightcode = mapVars.get("weightcode").toString().trim();

    }

    private double extractNumber(String input) {
        if (input == null)
            return -1;

        // Keep digits, optional minus, optional decimal
        String cleaned = input.replaceAll("[^0-9.-]", "");

        // Edge cases
        if (cleaned.isEmpty() || cleaned.equals("-") || cleaned.equals(".")) {
            return -1;
        }

        try {
            return Double.parseDouble(cleaned);
        } catch (Exception e) {
            return -1;
        }
    }

    public void startListening() {

        if (!portName.equals("RND")) {
            port = SerialPort.getCommPort(portName);
            port.setBaudRate(9600);
            port.setNumDataBits(8);
            port.setNumStopBits(SerialPort.ONE_STOP_BIT);
            port.setParity(SerialPort.NO_PARITY);

            if (!port.openPort()) {
                System.out.println("Cannot open port: |" + portName + "|");
                return;
            }

            System.out.println("Listening on " + portName);

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("\nShutting down... closing serial port.");
                if (port != null && port.isOpen()) {
                    port.closePort();
                    System.out.println(port.getSystemPortName() + " closed ...");
                }
            }));
            try {
                byte[] buffer = new byte[1024];

                while (true) {
                    int available = port.bytesAvailable();

                    if (available > 0) {
                        int read = port.readBytes(buffer, available);
                        String data = new String(buffer, 0, read);
                        System.out.println("Received: " + data);
                        lastKg = extractNumber(data);
                        if (lastKg > 0)
                            sendWeightToServer(lastKg);
                    }
                    Thread.sleep(50);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                port.closePort();
            }

        } else {
            DecimalFormat df = new DecimalFormat("#.00");
            while (true) {
                lastKg = Math.random() * (10000 - 5000 + 1) + 5000;
                lastKg = Double.parseDouble(df.format(lastKg));
                System.out.println("Random generated : " + lastKg + " KG");
                if (lastKg > 0)
                    sendWeightToServer(lastKg);
                try {
                    Thread.sleep(100);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void sendWeightToServer(double weight) {
        try {
            String url = server_url + "weightbridge?value=" + weight + "&code=" + weightcode;

            java.net.URL serverUrl = new java.net.URL(url);
            java.net.HttpURLConnection con = (java.net.HttpURLConnection) serverUrl.openConnection();
            con.setRequestMethod("GET");
                        
            int responseCode = con.getResponseCode();
            System.out.print("Server responded: " + responseCode + " from weightcode=" + weightcode + "  , ");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public PortReader(String filename) {
        try {
            readIniFile(filename);
            startListening();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
