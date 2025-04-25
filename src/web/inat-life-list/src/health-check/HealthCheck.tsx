import React from 'react';

export const HealthCheck = ():React.ReactElement =>{
    const apiUrl = import.meta.env.VITE_REACT_APP_INATLIFELIST_API_URL;
    const [status, setStatus] = React.useState<string | null>(null);

    React.useEffect(() => {
      fetch(`${apiUrl}/health`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
        })
        .catch(() => setStatus("Error"));
    }, [apiUrl]);
  
    return (
      <div>
        <pre>Server Status: {status ?? "Loading..."}</pre>
      </div>
    );
}

export default HealthCheck;