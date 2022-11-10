import React from 'react'

export default function homePage() {
    return(
        <div class="back">

        <div class="header">
            <img class="logo" src="./polar (2).png"/>
            <button id = "connectButton">Connect device</button>
        </div>
        <hr/>
        <div class="stats-container">
            <div class="small-column">
                <div class="data dataText">0</div>
                <div class="data dataUnit">khm/h</div>
            </div>
            <div class="small-column">
                <div id="clock" class="data dataText" onload="currentTime()">15:15</div>
                
            </div>
            <div class="small-column">
                <div class="data dataText">0</div>
                <div class="data dataUnit">BPM</div>
            </div>
        </div>
        <hr/>
        <div class="stats-container">
            <div class="small-column">
                <div class="data dataText">60</div>
                <div class="data dataUnit">Lowest BPM</div>
            </div>
            <div class="small-column">
                <div>
               <img id="heartSprite" src = "./heart.png" hidden="true"/>
               <div id="dataText" class="dataText">0</div>
               <div class="dataUnit">BPM</div>
                </div>
            </div>
            <div class="small-column">
                <div class="data dataText">120</div>
                <div class="data dataUnit">Highest BPM</div>
            </div>
        </div>
        <hr/>
        <div class="graph-container">
            <div class="big-column">
                <div id="chart_div_1" class="graph"></div>
                <div class="graph-name2">ECG</div>
            </div>
            <div class="big-column">
                <div id="chart_div_2" class="graph"></div>
                <div class="graph-name">PPG</div>
            </div>
        </div>
    </div>
    )
}