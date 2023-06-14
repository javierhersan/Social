import { useState, useEffect} from "react";
import { BarChart, Bar, XAxis, /*YAxis,*/ LabelList} from "recharts";

const Stats = () => {

    let [failedRequests, setFailedRequests] = useState([]);

    let renderLabel = function(object) {
        return <>{object.failedRequests}</>
    }

    useEffect(()=>{
        let failedRequestsProvider1 = window.localStorage.getItem("stats-provider1-failed-requests");
        if(failedRequestsProvider1 === null){
            window.localStorage.setItem("stats-provider1-failed-requests",0);
            failedRequestsProvider1 = 0;
        }
        let failedRequestsProvider2 = window.localStorage.getItem("stats-provider2-failed-requests");
        if(failedRequestsProvider2 === null){
            window.localStorage.setItem("stats-provider2-failed-requests",0);
            failedRequestsProvider2 = 0;
        }
        let failedRequestsProvider3 = window.localStorage.getItem("stats-provider3-failed-requests");
        if(failedRequestsProvider3 === null){
            window.localStorage.setItem("stats-provider3-failed-requests",0);
            failedRequestsProvider3 = 0;
        }
        setFailedRequests(
            [
                {name: 'Provider 1', failedRequests: parseInt(failedRequestsProvider1)},
                {name: 'Provider 2', failedRequests: parseInt(failedRequestsProvider2)},
                {name: 'Provider 3', failedRequests: parseInt(failedRequestsProvider3)}
            ]
        );
    },[])
    
    return (
        
        <div className="p-5">
            <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"/>
                </svg>
                {" "} Stats
            </h3>
            <hr></hr>
            <div className="ps-0 ms-0 pb-5">
                <h5 className="ps-2 pt-3">Failed Requests</h5>
                <div className="">
                    <BarChart  width={400} height={200} data={failedRequests} className="border rounded">
                        {/* <XAxis dataKey="name" /> */}
                        <XAxis dataKey="name" axisLine={false} tick={false} /*hide*/ />
                        {/* <YAxis /> */}
                        <Bar dataKey="failedRequests" barSize={80} fill="#8884d8" label={renderLabel} radius={8}>
                            <LabelList
                                dataKey="failedRequests"
                                position="insideBottom"
                                angle={0}
                                offset={10}
                                fill="white"
                            />
                            <LabelList
                                dataKey="name"
                                position="insideBottom"
                                angle={0}
                                offset={-20}
                                fill="black"
                            />
                        </Bar>
                    </BarChart>
                </div>
            </div>
        </div>
        
        );

}

export default Stats;