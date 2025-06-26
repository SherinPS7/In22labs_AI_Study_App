// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import Grids from "@/assets/grid-lines.png";
// import Stars from "@/assets/stars.png";

// const Hero = () => {
//   return (
//     <main className="bg-[radial-gradient(100%_100%_at_center,hsl(142.1,76.2%,36.3%,0.4)_5%,hsl(142.1,66%,38%,0.2)_20%,transparent_100%)]">
//       <div
//         className="min-h-[90vh] flex w-full relative px-4 md:px-0 justify-center items-center bg-cover bg-center"
//         style={{
//           backgroundImage: `url(${Stars})`,
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <main className="max-w-2xl z-10 relative mx-auto text-center space-y-4 bg-cover bg-center">
//           <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
//             Supercharge Your Learning with Smart AI & Seamless Integrations
//           </h1>
//           <p className="text-sm font-normal tracking-tight leading-relaxed text-muted-foreground">
//             Struggling to stay organized? Our AI-powered study assistant helps
//             you manage notes, schedule study sessions, and collaborate
//             effortlessly with Notion, Google Calendar, and more. Track your
//             progress, get instant answers, and stay ahead—all in one place!
//           </p>

//           <main className="flex flex-row gap-4 items-center justify-center">
//             <Button variant={"outline"} size={"sm"} asChild>
//               <Link to={"/sign-up"}>Get Started</Link>
//             </Button>

//             <Button variant={"default"} size={"sm"} asChild>
//               <Link to={"/pricing"}>Learn More</Link>
//             </Button>
//           </main>
//         </main>

//         {/* Decorative Images for Larger Screens */}
//         <main className="h-[90vh] absolute w-screen hidden md:block">
//           <img
//             src="/cta (1).png"
//             alt="cta 1"
//             className="h-[40vh] w-[40vh] object-cover absolute top-32 left-28"
//           />
//         </main>

//         <main className="h-[90vh] w-screen absolute hidden md:block">
//           <img
//             src="/cta (2).png"
//             alt="cta 2"
//             className="h-[45vh] w-[40vh] object-cover absolute bottom-12 right-12"
//           />
//         </main>

//         {/* Gradient Overlay with Reduced Opacity at the Bottom */}
//         <main className="absolute inset-0 h-[90vh] w-full overflow-hidden rounded-xl">
//           <div
//             className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent to-black"
//             style={{
//               backgroundImage: `url(${Grids})`,
//               backgroundRepeat: "repeat",
//               opacity: 0.2, // Adjust opacity here for the bottom part
//             }}
//           />
//         </main>
//       </div>
//     </main>
//   );
// };

// export default Hero;
// Enhanced Hero Section
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Grids from "@/assets/grid-lines.png";
import Stars from "@/assets/stars.png";
import { useCheckSession } from "@/hooks/use-check-session";

const Hero = () => {
  useCheckSession();
  return (
    <main className="relative overflow-hidden bg-[radial-gradient(100%_100%_at_center,hsl(142.1,76.2%,36.3%,0.4)_5%,hsl(142.1,66%,38%,0.2)_20%,transparent_100%)]">
      <div
        className="min-h-[90vh] flex w-full relative px-4 md:px-0 justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${Stars})`,
          backgroundRepeat: "no-repeat",
        }}
      >
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl z-10 relative mx-auto text-center space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
          Your AI-Powered Study Plan Curator
          </h1>
          <p className="text-lg font-normal leading-relaxed text-gray-600 dark:text-gray-300">
          Transform your study sessions with personalized plans, smart scheduling, 
          and progress tracking. Our AI creates the perfect roadmap for your academic success.
          </p>

          <div className="flex flex-row gap-4 items-center justify-center">
            <Button variant={"default"} size={"lg"} asChild className="gap-2">
              <Link to={"/sign-up"}>
                <span>Create your plan</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </Button>

            <Button variant={"outline"} size={"lg"} asChild>
              <Link to={"/features"} className="flex items-center gap-2">
                <span>How it works</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </Link>
            </Button>
          </div>
        </motion.main>

        {/* Animated decorative elements */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="h-[90vh] absolute w-screen hidden md:block"
        >
          <img
            src="/cta (1).png"
            alt="Decorative illustration"
            className="h-[40vh] w-[40vh] object-cover absolute top-32 left-28"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="h-[90vh] w-screen absolute hidden md:block"
        >
          <img
            src="/cta (2).png"
            alt="Decorative illustration"
            className="h-[45vh] w-[40vh] object-cover absolute bottom-12 right-12"
          />
        </motion.div>

        {/* Animated grid background */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 h-[90vh] w-full overflow-hidden"
          style={{
            backgroundImage: `url(${Grids})`,
            backgroundRepeat: "repeat",
          }}
        />
      </div>
    </main>
  );
};

export default Hero;