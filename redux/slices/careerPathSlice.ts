import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import * as fs from 'fs';
import * as SecureStore from 'expo-secure-store';
import { hideLoading, showLoading } from "./loadingSlice";
import { fetch } from 'expo/fetch'
import { useEventListener } from "expo";
import EventSource from "react-native-sse";

const initialState = {
    
};

type EventSourceCustomEvents = "data" | "end";

export const testStream = createAsyncThunk(
    'careerPath/testStream',
    async (_, thunkAPI) => {
        const data = {
            job_title: "Data engineer",
            current_match_level: "None",
            next_level: "Intern",
            user_skills: [
                {
                SkillName: "JavaScript",
                Proficiency: "Novice",
                YearExperience: 1,
                },
                {
                SkillName: "Python",
                Proficiency: "Beginner",
                YearExperience: 0.5,
                },
                {
                SkillName: "React.js",
                Proficiency: "Novice",
                YearExperience: 1,
                },
                {
                SkillName: "Node.js",
                Proficiency: "Beginner",
                YearExperience: 0.5,
                },
                {
                SkillName: "SQL",
                Proficiency: "Beginner",
                YearExperience: 1,
                },
                { SkillName: "Git", Proficiency: "Novice", YearExperience: 1 },
                {
                SkillName: "Docker",
                Proficiency: "Beginner",
                YearExperience: 0.5,
                },
                {
                SkillName: "REST API",
                Proficiency: "Novice",
                YearExperience: 1,
                },
                {
                SkillName: "TypeScript",
                Proficiency: "Beginner",
                YearExperience: 0.5,
                },
                {
                SkillName: "Agile Development",
                Proficiency: "Novice",
                YearExperience: 1,
                },
            ],
        }
        

        const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
        const accessToken = await SecureStore.getItemAsync('accessToken');
        // const res = await fetch(`${API_URL}/job-suggestion-testing/test-streaming`, {
        //     method: "POST",
        //     body: JSON.stringify(data),
        //     headers: {
        //         "Content-Type": "application/json",
        //         // Authorization: "Bearer " + accessToken,
        //         Accept: 'text/event-stream' 
        //     },
            
        // })

        // if (res.body) {
        //     const reader = res.body.getReader();
        //     let str = ""
        //     while (true && reader != null) {
        //         const { done, value } = await reader.read();
        //         if (done) {
        //             break;
        //         }
                
        //         console.log(new TextDecoder().decode(value))
        //     }
        // }

        const es = new EventSource<EventSourceCustomEvents>(`${API_URL}/job-suggestion-testing/test-streaming`, {
            method: "POST",
            body: JSON.stringify(data),
            pollingInterval: 0,
            debug: true,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            }
        })
        es.addEventListener("data", (event) => {
            console.log(event.data)
        })
        es.addEventListener("open", (event) => {
            // thunkAPI.dispatch(showLoading("Streaming data..."))
        })
        // es.addEventListener("done", (event) => {
        //     console.log("f")
        //     // thunkAPI.dispatch(hideLoading())
        // })
        es.addEventListener("error", (event) => {
            console.log(event)
            // thunkAPI.dispatch(hideLoading())
        })
    }
)

const careerPathSlice = createSlice({
    name: "careerPath",
    initialState,
    reducers: {
        reset(state) {
            
        }

    },
    extraReducers (builder) {
        
    },
});

export const { reset } = careerPathSlice.actions;
export default careerPathSlice.reducer;