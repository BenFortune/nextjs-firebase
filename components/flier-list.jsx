export default function FlierList({flierList}) {
  return(
    <>
      {flierList.length
        ? <ul aria-label="ricks-list-flier-list">
          {flierList.map((flierItem, index) => {
            return (
              <li key={flierItem.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={flierItem.imageSrc} alt={flierItem.name} style={{width: '10%', height: '10%'}}/>
              </li>
            );
          })}
        </ul>
        : <div>No Fliers Found</div>}
    </>
  );
}