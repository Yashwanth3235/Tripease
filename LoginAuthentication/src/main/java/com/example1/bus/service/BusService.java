package com.example1.bus.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BusService {

    @Value("${bus.api.key:}") // Optional, if using a real API later
    private String apiKey;

    @Value("${bus.api.host:}") // Optional, if using a real API later
    private String apiHost;

    private final RestTemplate restTemplate = new RestTemplate();

    // 🚌 BUSES BETWEEN CITIES
    public String getBusesBetween(String from, String to) {

        return "[\n" +
                "  {\"bus_id\":\"B001\",\"operator\":\"RedBus\",\"type\":\"AC Sleeper\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":40,\"fare\":500},\n" +
                "  {\"bus_id\":\"B002\",\"operator\":\"Travelyaari\",\"type\":\"Non-AC Seater\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":25,\"fare\":450},\n" +
                "  {\"bus_id\":\"B003\",\"operator\":\"VRL Travels\",\"type\":\"AC Sleeper\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":30,\"fare\":750},\n" +
                "  {\"bus_id\":\"B004\",\"operator\":\"Orange Tours\",\"type\":\"Volvo AC\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":18,\"fare\":900},\n" +
                "  {\"bus_id\":\"B005\",\"operator\":\"SRS Travels\",\"type\":\"Non-AC Sleeper\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":32,\"fare\":600},\n" +
                "  {\"bus_id\":\"B006\",\"operator\":\"KPN Travels\",\"type\":\"AC Seater\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":28,\"fare\":650},\n" +
                "  {\"bus_id\":\"B007\",\"operator\":\"Morning Star\",\"type\":\"AC Sleeper\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":35,\"fare\":800},\n" +
                "  {\"bus_id\":\"B008\",\"operator\":\"National Travels\",\"type\":\"Non-AC Seater\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":22,\"fare\":480},\n" +
                "  {\"bus_id\":\"B009\",\"operator\":\"Sharma Transport\",\"type\":\"AC Sleeper\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":20,\"fare\":720},\n" +
                "  {\"bus_id\":\"B010\",\"operator\":\"IntrCity\",\"type\":\"Volvo AC\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":26,\"fare\":880},\n" +
                "  {\"bus_id\":\"B011\",\"operator\":\"GreenLine\",\"type\":\"AC Seater\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":29,\"fare\":670},\n" +
                "  {\"bus_id\":\"B012\",\"operator\":\"Parveen Travels\",\"type\":\"AC Sleeper\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":24,\"fare\":730},\n" +
                "  {\"bus_id\":\"B013\",\"operator\":\"SRM Travels\",\"type\":\"Non-AC Seater\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":36,\"fare\":520},\n" +
                "  {\"bus_id\":\"B014\",\"operator\":\"Kesineni Travels\",\"type\":\"AC Sleeper\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":21,\"fare\":790},\n" +
                "  {\"bus_id\":\"B015\",\"operator\":\"Jabbar Travels\",\"type\":\"Volvo AC\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":19,\"fare\":910},\n" +
                "  {\"bus_id\":\"B016\",\"operator\":\"Diwakar Travels\",\"type\":\"Non-AC Sleeper\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":31,\"fare\":610},\n" +
                "  {\"bus_id\":\"B017\",\"operator\":\"APSRTC\",\"type\":\"Express\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":45,\"fare\":400},\n" +
                "  {\"bus_id\":\"B018\",\"operator\":\"TSRTC\",\"type\":\"Super Luxury\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":38,\"fare\":550},\n" +
                "  {\"bus_id\":\"B019\",\"operator\":\"KSRTC\",\"type\":\"AC Sleeper\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":27,\"fare\":760},\n" +
                "  {\"bus_id\":\"B020\",\"operator\":\"TNSTC\",\"type\":\"Non-AC Seater\",\"from\":\"" + from + "\",\"to\":\"" + to + "\",\"date\":\"2026-03-01\",\"seats_available\":42,\"fare\":420}\n" +
                "]";
    }
}