package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
public class MainController {

    @RequestMapping("/")
    public String main(Map<String, Object> model) { return "main"; }

    @RequestMapping("/addPlace")
    public String addPlace(Map<String, Object> model) { return "addPlace"; }

    @RequestMapping("/addRoute")
    public String addRoute(Map<String, Object> model) { return "addRoute"; }

    @RequestMapping("/surfaceExchange")
    public String surfaceExchange(Map<String, Object> model) { return "surfaceExchange"; }

}
