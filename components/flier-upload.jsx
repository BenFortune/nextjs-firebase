export default function FlierUpload() {
  return (
    <>
      <label htmlFor="event-flier-upload">Upload Flier</label>
      <input id="event-flier-upload" type="file" accept="image/*" data-testid="event-flier-upload"/>
    </>
  );
}