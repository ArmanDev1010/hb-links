"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

export default function ContactPage() {
  const fields = [
    { place: "Name", clean: "name" },
    { place: "Phone Number", clean: "phone" },
    { place: "Email", clean: "mail" },
    { place: "Address", clean: "address" },
  ];

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) => {
    // handle form submission
    console.log(data);
    reset();
    handleClose();
  };

  return (
    <motion.div
      className="relative w-full h-screen bg-white overflow-auto bg-white z-[1] flex flex-col justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-[50px]"></div>
      <div className="max-h-fit w-full flex flex-col justify-center items-center">
        <h2 className="capitalize text-4xl mb-[60px] pointer-events-none">
          Request <span className="font-semibold text-secondary">Callback</span>
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 h-full justify-center w-full max-w-[528px]"
        >
          {fields.map(({ place, clean }) => (
            <div
              className="w-full py-[7px] mb-[7px] text-[15px] font-medium border-b border-gray-200"
              key={clean}
            >
              <div className="relative w-full">
                <input
                  {...register(clean)}
                  className="peer w-full outline-none bg-transparent relative z-10"
                  required
                  placeholder=" "
                />
                {/* Fake placeholder */}
                <div
                  className="absolute top-0 left-0 right-0 flex justify-between text-gray-400 font-light pointer-events-none
                  peer-focus:hidden peer-[&:not(:placeholder-shown)]:hidden"
                >
                  <span className="">{place}</span>
                  <span className="text-lg">*</span>
                </div>
              </div>
            </div>
          ))}
          <div className="relative mt-[30px] mx-auto">
            <button
              type="submit"
              className="relative w-fit cursor-pointer text-lg uppercase bottom_line_reverse
              after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[-50px] after:w-[35px] after:h-[15px] 
              after:bg-transparent after:bg-no-repeat after:bg-center after:bg-contain after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAzNCAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuMDkwMjUgNi4yODE5OEM0LjA5MDI1IDguMTE0OTggNC43NjYyNSA5LjgzMDk4IDUuNDk0MjUgMTEuMDAxSDYuMjg3MjVDNS40NDIyNSA5LjUwNTk4IDUuMDAwMjUgOC4wMzY5OCA1LjAwMDI1IDYuMjgxOThDNS4wMDAyNSA0LjUyNjk4IDUuNDQyMjUgMy4wNzA5OCA2LjI4NzI1IDEuNTc1OThINS40OTQyNUM0Ljc2NjI1IDIuNzQ1OTggNC4wOTAyNSA0LjQ3NDk4IDQuMDkwMjUgNi4yODE5OFpNMzMuNDQ1NSA2LjI4MTk4QzMzLjQ0NTUgNC40NzQ5OCAzMi43Njk1IDIuNzQ1OTggMzIuMDQxNSAxLjU3NTk4SDMxLjI0ODVDMzIuMDkzNSAzLjA3MDk4IDMyLjUzNTUgNC41MjY5OCAzMi41MzU1IDYuMjgxOThDMzIuNTM1NSA4LjAzNjk4IDMyLjA5MzUgOS41MDU5OCAzMS4yNDg1IDExLjAwMUgzMi4wNDE1QzMyLjc2OTUgOS44MzA5OCAzMy40NDU1IDguMTE0OTggMzMuNDQ1NSA2LjI4MTk4WiIgZmlsbD0iIzY3NUI1MSIvPgo8cGF0aCBkPSJNMTEuNTA3OCA1LjkzMzA0TDI2LjMyMjEgNS45MzMwNSIgc3Ryb2tlPSIjNjc1QjUxIi8+CjxwYXRoIGQ9Ik0yNi40OTcxIDUuODk0NTNDMjMuNzE2NyA1LjgyMjk5IDE4LjE5OTIgNC43NjEyOCAxOC4xOTkyIDEuMDAwOTMiIHN0cm9rZT0iIzY3NUI1MSIvPgo8cGF0aCBkPSJNMjYuNDk3MSA1Ljg5NDUzQzIzLjcxNjcgNS45NjkxOSAxOC4xOTkyIDcuMDc3MDYgMTguMTk5MiAxMS4wMDA5IiBzdHJva2U9IiM2NzVCNTEiLz4KPC9zdmc+Cg==')]"
            >
              Send Request
            </button>
            <p className="absolute top-1/2 -translate-y-1/2 left-[110%] w-[200px] text-sm text-gray-400">
              (info@hb-links.com)
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
