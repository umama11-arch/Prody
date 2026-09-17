import React, { useEffect,useState } from 'react'
import ReactMarkdown from "react-markdown";
import "./Ai.css"
import axios from 'axios';

const Ai = ({isloginuser,setPage}) => {
    const [aiInsights, setAiInsights] = useState("");
    const [airoutine,setairoutine]=useState([])
     const [interactionId, setInteractionId] = useState(null);
    const [ismodify,setismodify]=useState(false)
    const [userMessage, setUserMessage] = useState("");
    const [AIreply,setAIreply]=useState("");
    const [modifytext,setmodifytext]=useState("")
    const[bestStreak,setBestStreak]=useState(0)
const [currentStreak, setCurrentStreak] = useState(0);
const [day,setday]=useState("");
const [maximum,setmaximum]=useState(0)
const [lastweekproductivity,setlastweekproductivity]=useState(0)
const [currmonth,setcurrmonth]=useState(0)
 const [weekdays, setWeekdays] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

 
useEffect(() => {
  
}, [])
const getlastweeklyreports = async () => {

  const res = await axios.get(
    `${API_URL}/getlastweeklyreport/${isloginuser}`
  );
  
  return res.data;
};


const currentmonthproductivity=async()=>{
  const res = await axios.get(
    `${API_URL}/currmonthpro/${isloginuser}`
  );
  return res.data;
};


const getAllProductivity = async () => {
  const res = await axios.get(
    `${API_URL}/allproductivity/${isloginuser}`
  );
const getallproductivity = async () => {
  const res = await axios.get(
    `${API_URL}/getallproductivity/${isloginuser}`
  );

  return res.data;
};
let count = 0;
let maxi = 0;

const getstreak = async () => {

  const reports = await getallproductivity();

  reports.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  reports.forEach((report) => {

    if (Number(report.taskPercent) >= 50) {

      count++;

      maxi = Math.max(count, maxi);

    } else {

      count = 0;

    }
setCurrentStreak(count);
setBestStreak(maxi)
  });

  console.log("Current streak:", count);
  console.log("Best streak:", maxi);
};

  return res.data;
};

const loadlastweekreports=async()=>{
  const reports=await getlastweeklyreports();

  const sum=reports.reduce((total,report)=>{
    const percentage=Number(report.taskPercent)
    return total+percentage
  },0)
  const averageproductivity=reports.length===0?0:sum/reports.length;
  setlastweekproductivity(averageproductivity);
  console.log(averageproductivity,"%");
  
  
  const bestWorst = reports.reduce(
  (result, report) => {
    
    const percentage = Number(report.taskPercent);
    
    if (percentage > result.best.percentage) {
      result.best = {
        percentage,
        date: report.date
      };
    }
    
    if (percentage < result.worst.percentage) {
      result.worst = {
        percentage,
        date: report.date
      };
    }

    return result;
  },
  {
    best: {
      percentage: -Infinity,
      date: null
    },
    worst: {
      percentage: Infinity,
      date: null
    }
  }
);


const bestDay = new Date(bestWorst.best.date).toLocaleDateString(
  "en-US",
  { weekday: "long" }
);
setday(bestDay)
setmaximum(bestWorst.best.percentage)
const worstDay = new Date(bestWorst.worst.date).toLocaleDateString(
  "en-US",
  { weekday: "long" }
);
}
loadlastweekreports()
const currentmonthaverage=async()=>{
  const reports=await currentmonthproductivity()
  
  const sum=reports.reduce((total,report)=>{
    const percentage=Number(report.taskPercent)
    return total+percentage;
  },0)

  const average=sum/reports.length;
  setcurrmonth(average);


}

const getweeklyreports=async()=>{
  const res=await axios.get(`${API_URL}/getweeklyreport/${isloginuser}`)
  return res.data;
}

const loadReports = async () => {
  
  const reports = await getweeklyreports();


const day = [
  { day: "Mon", productivity: null },
  { day: "Tue", productivity: null },
    { day: "Wed", productivity: null },
    { day: "Thu", productivity: null },
    { day: "Fri", productivity: null },
    { day: "Sat", productivity: null },
    { day: "Sun", productivity: null }
  ];
  
  const productivityData = day.map((d) => {
    
    const report = reports.find((r) => {

      const reportDay = new Date(r.date).toLocaleDateString("en-US", {
        weekday: "short"
      });

      return reportDay === d.day;
    });

    return {
      day: d.day,
      productivity: report ? report.taskPercent : null
    };
  });
  setWeekdays(productivityData);
};
let productivedays = 0;
let sum = 0;

weekdays.forEach((day) => {

  if (day.productivity !== null) {
    productivedays++;
    sum += Number(day.productivity);
  }
  
});
const averageproductivity =
productivedays === 0
    ? 0
    : sum / productivedays;

    const getgoal=async()=>{
            const res=await axios.get(`${API_URL}/getgoal?userid=${isloginuser}`)
            return res.data;
        };
    const goalreport = async () => {
     const reports= await getgoal();
     const productivityReports = await getAllProductivity();
    
      const goalData = reports.map((goal) => {
        const created = new Date(goal.createdAt);
        const endDate = new Date(created);
    
        if (goal.durationUnit === "days") {
          endDate.setDate(endDate.getDate() + goal.duration);
        }
    
        if (goal.durationUnit === "months") {
          endDate.setMonth(endDate.getMonth() + goal.duration);
        }
        if (goal.durationUnit === "weeks") {
          endDate.setDate(endDate.getDate() + goal.duration * 7);
        }
    
         if (goal.durationUnit === "years") {
          endDate.setFullYear(endDate.getFullYear() + goal.duration);
        }
       const today = new Date();
    created.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diff = today - created;
    const daysElapsed = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const diffre=endDate-today;
    const daysRemaining=Math.floor(diffre / (1000 * 60 * 60 * 24 ));
        // const percentages = [];
    
        // productivityReports.forEach((report) => {
          
        //   const found = report.goalPercent.find(
        //     (g) => String( g.goalid) === String( goal._id)
        //   );
    
        //   if (found) {
        //     percentages.push(found.percentage);
        //   }
    
        // });
    
        const history = [];
    
    productivityReports.forEach((report) => {
    
      const found = (report.goalPercent || []).find(
        (g) => String(g.goalid) === String(goal._id)
      );
    
      if (found) {
        history.push({
          date: report.date,
          percentage: Number(found.percentage)
        });
      }
    
    });
    const percentages = history.map(
      (item) => item.percentage
    );
        const total = percentages.reduce(
      (sum, percentage) => sum + percentage,
      0
    )
    const average =
      percentages.length === 0
        ? null
        : total / percentages.length;
    let count=0,mincount=0,longestinactive=0;
    percentages.forEach((per)=>{
      if (per>0){
        count++;
        mincount=0;
      }
      if(per===0){
        mincount++;
        longestinactive=Math.max(longestinactive,mincount)
      }
    })
    
    const inactivedays=percentages.length-count
    
     const totalGoalDays = Math.ceil(
        (endDate - created) /
        (1000 * 60 * 60 * 24)
      );
    
      const earlyDays = Math.ceil(
        totalGoalDays * 0.20
      );
    
      const earlyHistory = history.filter((item) => {
        const itemDate = new Date(item.date);
    
        const daysFromStart = Math.floor(
          (itemDate - created) /
          (1000 * 60 * 60 * 24)
        );
    
        return daysFromStart < earlyDays;
      });
    
      const earlyAverage =
        earlyHistory.length === 0
          ? null
          : earlyHistory.reduce(
              (sum, item) => sum + item.percentage,
              0
            ) / earlyHistory.length;
    
    
      // -------------------------
      // RECENT AVERAGE
      // -------------------------
    
      const recentCount = Math.ceil(
        history.length * 0.20
      );
    
      const recentHistory =
        recentCount > 0
          ? history.slice(-recentCount)
          : [];
    
      const recentAverage =
        recentHistory.length === 0
          ? null
          : recentHistory.reduce(
              (sum, item) => sum + item.percentage,
              0
            ) / recentHistory.length;
    
    
        return {
          goalid: goal._id,
          goaldisc:goal.description,
          title: goal.title,
          createdAt: created,
          endDate: endDate,
          duration: goal.duration,
          durationUnit: goal.durationUnit,
          dayelapsed:daysElapsed,
          daysremaining:daysRemaining,
          averag:average,
          activedays:count,
          Inactivedays:inactivedays,
          history,
          longestinactive,
          earlyAverage,
          recentAverage,
          currentinactive:mincount
        };
      });
    return goalData
      
    };
    
const getAIInsights = async () => {
const goalData=await goalreport()
  const aiData = {

    // Overall productivity
    overallProductivity: {
      currentWeekAverage: averageproductivity,
      lastWeekAverage: lastweekproductivity,
      currentMonthAverage: currmonth,
      currentMonthDaysPassed: new Date().getDate(),

      bestDay: {
        day,
        productivity: maximum
      },

      currentStreak,
      bestStreak
    },

    // Detailed goal information
    goals: goalData

    ,isloginuser:isloginuser
  };

  console.log("AI DATA:", aiData);
console.log("i am ",isloginuser)
  const res = await axios.post(
    `${API_URL}/ai-insights`,
    aiData
  );

  console.log(res.data);
  setAiInsights(res.data.insights);
  setInteractionId(res.data.interactionId);
};
const sendMessage = async () => {
  if (!userMessage.trim()) return;

  try {
    console.log("past response is ",interactionId)
    const res = await axios.post(
      `${API_URL}/ai-chat`,
      {
        isloginuser,
        interactionId: interactionId,
        message: userMessage
      }
    );

    console.log("AI CHAT RESPONSE:", res.data);
    setUserMessage("");
    setAIreply(res.data.response);
  } catch (error) {
    console.log("CHAT ERROR:", error);
  }
};
 const approveRoutine = async () => {
  try {
    for (const task of airoutine) {
      
      await axios.post(`${API_URL}/addtask`, {
        ...task,
        userid: isloginuser
      });

    }

    console.log("Routine approved and tasks added!");
    
  } catch (error) {
    console.log("Error adding routine:", error);
  }
};
const generateRoutine = async() => {
  const goalData=await goalreport()
  const aiData = {

    // Overall productivity
    overallProductivity: {
      currentWeekAverage: averageproductivity,
      lastWeekAverage: lastweekproductivity,
      currentMonthAverage: currmonth,
      currentMonthDaysPassed: new Date().getDate(),

      bestDay: {
        day,
        productivity: maximum
      },

      currentStreak,
      bestStreak
    },

    // Detailed goal information
    goals: goalData

    ,isloginuser:isloginuser
  };
console.log(isloginuser,"is clicked")
  const res=await axios.post(`${API_URL}/generate-routine`,{
    interactionId,
    aiData
  })
  console.log("Generate routine clicked");
  localStorage.setItem("routine",res.data.interactionid)
 const routine = JSON.parse(res.data.content);

setairoutine(routine.tasks);

return routine;
};
 const modifyRoutine = async () => {
  const routine = localStorage.getItem("routine");

  if (routine === null) {
    console.log("Create a Routine first");
    return;
  }

  const res = await axios.post(
    `${API_URL}/modify-routine`,
    { modifytext, isloginuser, routine }
  );
setairoutine([])
  console.log(res);

  const modifiedRoutine = res.data.content;

  setairoutine(modifiedRoutine.tasks);

  return modifiedRoutine;
};
  console.log("hello guys",localStorage.getItem("routine"))



 return (
  <div className="ai-page">

    {/* Mentor Advice */}
    <button
      className="mentor-btn"
      onClick={getAIInsights}
    >
      ✨ Get Mentor Advice
    </button>

    <div className="ai-insights">
      <ReactMarkdown>
        {aiInsights}
      </ReactMarkdown>
    </div>


    {/* Chat */}
    <div className="chat-input">
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Tell me what's going on..."
      />

      <button onClick={sendMessage}>
        Send
      </button>
    </div>

    <div className="ai-insights">
      <ReactMarkdown>
        {AIreply}
      </ReactMarkdown>
    </div>


    {/* Routine */}
    <button
      className="generate-routine-btn"
      onClick={generateRoutine}
    >
      ✨ Generate Routine
    </button>


    {/* Routine Tasks */}
    {airoutine.length > 0 && (
      <>
        <div className="routine-list">
          {airoutine.map((task, index) => (
            <div className="routine-task" key={index}>
              <h3>{task.task}</h3>
              <p>⏰ {task.time}</p>
              <p>⚡ {task.priority}</p>
              <p>🎯 {task.category}</p>
            </div>
          ))}
        </div>

        {/* Routine Actions */}
        <div className="routine-actions">
          <button
            className="approve-btn"
            onClick={approveRoutine}
          >
            ✓ Approve Routine
          </button>

          <button
            className="modify-btn"
            onClick={() => setismodify(true)}
          >
            Modify
          </button>
        </div>

        {ismodify && (
          <div className="modify-textbox">
            <input
              className="modify-input"
              value={modifytext}
              onChange={(e) => setmodifytext(e.target.value)}
              placeholder="What would you like to change?"
            />

            <button
              onClick={modifyRoutine}
              className="modify-submit"
            >
              Submit
            </button>
          </div>
        )}
      </>
    )}


    {/* Back */}
    <div className="back-section">
      <button
        className="back-analytics-btn"
        onClick={() => setPage("analytics")}
      >
        ← Back to Analytics
      </button>
    </div>

  </div>
);
}

export default Ai