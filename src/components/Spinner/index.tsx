//This's only example of the template

export default function Spinner() {
  return (
    <div className="items-center flex h-screen w-screen justify-center">
      <span className="w-[48px] h-[48px] border-[5px] border-solid border-gray-800 border-b-transparent rounded-[50%] inline-block box-border animate-spin" />
    </div>
  );
}
