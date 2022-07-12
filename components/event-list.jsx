import React from 'react';

export default function EventList({eventList}) {
  return(
    <>
      {eventList.length
        ? <table data-testid="event-list-table">
          <thead aria-label="event-list-table-header" key="event-list-table-head">
            <tr>
              <th>Date</th>
              <th>Event Name</th>
              <th>Event Time</th>
              <th>Event Address</th>
              <th>Event City</th>
              <th>Event State</th>
              <th>Contact</th>
              <th>Memo</th>
            </tr>
          </thead>
          <tbody aria-label="event-list-table-body" key="event-list-table-body">
            {eventList.map((item, index) => (
              <React.Fragment key={index}>
                <tr key={item.month}>
                  <td>{item.month}</td>
                </tr>
                {item.list ?
                  item.list.map((event) => (
                    <tr key={event.name}>
                      <td>{event.date}</td>
                      <td>{event.name}</td>
                      <td>{event.time}</td>
                      <td>{event.address}</td>
                      <td>{event.city}</td>
                      <td>{event.state}</td>
                      <td>{event.contact}</td>
                      <td>{event.memo}</td>
                    </tr>
                  ))
                  : <tr>
                    <td></td>
                  </tr>
                }
              </React.Fragment>
            ))}
          </tbody>
        </table>
        : <div>No events found.</div>
      }
    </>
  );
};