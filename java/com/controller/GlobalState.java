package com.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.generic.utils;

@Component
@Scope("singleton")
public class GlobalState {
    private String weight;
    private Map<String,String> weights=new HashMap<String,String>();

    public String getWeightValue(String s) {
        return utils.nvl(weights.get(s),"");
    }

    public void setWeightValue(String weight,String code) {
    	weights.put(utils.nvl(code,"1"), weight);
    }
};