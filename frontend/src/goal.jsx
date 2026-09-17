import React, { useState } from "react";
import axios from "axios";
import "./goal.css"
import { useEffect } from "react";

function Goal({ isloginuser }) {
  useEffect(()=>{
    loadReports();
  })
const [goalAnalytics,setgoalAnalytics]=useState([])
    const [Durationunit, setDurationunit] = useState("");
    const [title, settitle] = useState("");
    const [desc, setdisc] = useState("");
    const [Duration, setDuration] = useState(1);
    const [goalname,setgoalname]=useState("")
    const API_URL = process.env.REACT_APP_API_URL;

  
 
    const [goal,setgoal]=useState([])
    useEffect(() => {
getgoal();
}, []);
const getweeklyreports=async()=>{
  const res=await axios.get(`${API_URL}getweeklyreport/${isloginuser}`)
  return res.data;
}

const loadReports = async () => {
  const reports = await getweeklyreports();

  const goalRes = await axios.get(
    `${API_URL}/getgoal?userid=${isloginuser}`
  );

  const goals = goalRes.data;

  const goalPercentages = goals.map((goal) => {
    const percentages = [];

    reports.forEach((report) => {
      const found = report.goalPercent.find(
        (g) => String(g.goalid) === String(goal._id)
      );

      if (found) {
        percentages.push(found.percentage);
      }
    });

    return {
      goalid: goal._id,
      percentages
    };
  });

  const goalAnalytics = goalPercentages.map((goal) => {
    const goalinfo = goals.find(
      (g) => String(g._id) === String(goal.goalid)
    );

    const total = goal.percentages.reduce(
      (sum, percentage) => sum + percentage,
      0
    );

    const average =
      goal.percentages.length === 0
        ? null
        : total / goal.percentages.length;

    return {
      title: goalinfo ? goalinfo.title : "Goal",
      goalid: goal.goalid,
      dailyPercentages: goal.percentages,
      weeklyAverage: average
    };
  });

  console.log(goalAnalytics);
  setgoalAnalytics(goalAnalytics)
 
};

    const SubmitEvent = async (e) => {

        e.preventDefault();
        await axios.post(`${API_URL}setgoal`, {
            title: title,
            description: desc,
            duration: Duration,
            durationUnit: Durationunit,
            status: true,
            userid: isloginuser,

        });

        settitle("");
        setdisc("");
        setDuration(0)
        const goalData = {
            title,
            description: desc,
            duration: Duration,
            durationUnit: Durationunit
        };

        console.log(goalData);
    };

    const getgoal=async()=>{
        const res=await axios.get(`${API_URL}getgoal?userid=${isloginuser}`)
        setgoal(res.data)
    }

    const SelectGoal=(g)=>{
        // console.log(g.title,g._id)
        localStorage.setItem("activegoal",JSON.stringify({id:g._id,title:g.title}))
        console.log(localStorage.getItem(`activegoal`))
    }
    return (
        <div>

            <div className="goal-container">

                <form
                    className="goal-form"
                    id="goal-form-id"
                    onSubmit={SubmitEvent}
                >

                    <input
                        className="goal-title"
                        placeholder="Enter title"
                        required
                        value={title}
                        onChange={(e) => {
                            settitle(e.target.value);
                        }}
                    />

                    <input
                        className="goal-desc"
                        placeholder="Enter Description"
                        value={desc}
                        onChange={(e) => {
                            setdisc(e.target.value);
                        }}
                    />

                    <input
                        className="goal-duration"
                        name="duration"
                        type="number"
                        min="1"
                        required
                        value={Duration}
                        onChange={(e) => {
                            setDuration(Number(e.target.value));
                        }}
                    />

                    <select
                        className="goal-durationunit"
                        name="durationunit"
                        required
                        value={Durationunit}
                        onChange={(e) => {
                            setDurationunit(e.target.value);
                        }}
                    >

                        <option value="" disabled>
                            Select Duration
                        </option>

                        <option value="months">Months</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="years">Years</option>

                    </select>

                    <button type="submit">
                        Create Goal
                    </button>

                </form>

<div className="goal-select">

  <h3 className="goal-select-heading">
    Which goal do you want to work on?
  </h3>

  <div className="goal-list">
    {goal.map((g) => (
      <button
        key={g._id}
        onClick={() => SelectGoal(g)}
      >
        {g.title}
      </button>
    ))}
  </div>

</div>
            </div>
   <div className="goal-analytics">

          {goalAnalytics.map((goal) => (
            <div className="goal-summary" key={goal.goalid}>
          
              <h3>{goal.title}</h3>
          
          
              <p>
                Daily: {goal.dailyPercentages.join("%, ")}%
              </p>
          
              <p>
                Weekly Average:{" "}
                {goal.weeklyAverage === null
                  ? "--"
                  : `${goal.weeklyAverage.toFixed(1)}%`}
              </p>
            </div>
          ))}
          </div>

        </div>
    );
}

export default Goal;