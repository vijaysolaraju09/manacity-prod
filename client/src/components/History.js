import React, { useEffect } from "react";
import { Accordion } from "react-bootstrap";
import { useSelector } from "react-redux";

function History() {
  const userHistory = useSelector((state) => state.user.userDetails.history);

  const handleFormatDate = (orderDate) => {
    const dateObject = new Date(orderDate);
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    }).format(dateObject);
    return formattedDate;
  };
  console.log(userHistory);

  return (
    <>
      <Accordion defaultActiveKey="0" flush>
        {userHistory.map((data) => (
          <>
            {}
            <Accordion.Item eventKey={data.orderDate} key={data.orderDate}>
              <Accordion.Header className="shadow-none">
                <div className="d-flex justify-content-between w-100 me-3">
                  <small>{data.items.length} items</small>-
                  <small>{handleFormatDate(data.orderDate)}</small>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                {data.items.map((data) => (
                  <>{/* <p>{data.}</p> */}</>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </>
        ))}
      </Accordion>
    </>
  );
}

export default History;
