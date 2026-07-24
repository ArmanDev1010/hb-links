export default function ExpertiseIntro({ description }) {
  return (
    <div className="max-w-[1680px] 700:px-[1rem] mx-auto w-full px-[0.5rem]">
      <div className="1440:mx-auto 1440:w-[83.333%] w-full">
        <div className="w-full lg:w-10/12 lg:mx-auto px-2 text-center">
          <p className="text-sm uppercase font-xbold tracking-widest mb-4">
            Our Expertise
          </p>
          <h2 className="font-gt pb-1 font-semibold text-3xl lg:text-4xl leading-[1]">
            {description}
          </h2>
        </div>
      </div>
    </div>
  );
}
