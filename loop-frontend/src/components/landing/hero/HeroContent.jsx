import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../../common/Button";
import Badge from "../../common/Badge";

export default function HeroContent() {
  return (
    <div className="max-w-2xl">

      <Badge>
        <Sparkles size={14} />
        AI Powered Customer Intelligence
      </Badge>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .7 }}
        className="mt-8 text-5xl font-black leading-tight lg:text-7xl"
      >
        Turn Every
        <span className="block text-[#32E6A4]">
          Customer Voice
        </span>
        Into Better Decisions.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .2 }}
        className="mt-8 text-lg leading-8 text-white/65"
      >
        Collect, organize and analyze customer feedback using AI.
        Discover hidden trends, sentiment, recurring issues and
        actionable insights in seconds.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .35 }}
        className="mt-10 flex flex-wrap gap-4"
      >
        <Button size="lg">
          Start Free

          <ArrowRight
            size={18}
            className="ml-2 inline"
          />
        </Button>

        <Button
          size="lg"
          variant="secondary"
        >
          <PlayCircle
            size={18}
            className="mr-2 inline"
          />

          Watch Demo
        </Button>
      </motion.div>

      <div className="mt-12 flex items-center gap-5">

        <div className="flex -space-x-4">

          <img
            className="h-12 w-12 rounded-full border-2 border-[#050B0B]"
            src="https://i.pravatar.cc/100?img=11"
          />

          <img
            className="h-12 w-12 rounded-full border-2 border-[#050B0B]"
            src="https://i.pravatar.cc/100?img=15"
          />

          <img
            className="h-12 w-12 rounded-full border-2 border-[#050B0B]"
            src="https://i.pravatar.cc/100?img=18"
          />

        </div>

        <div>

          <h4 className="font-semibold">
            Trusted by 500+ companies
          </h4>

          <p className="text-sm text-white/55">
            4.9/5 average customer satisfaction
          </p>

        </div>

      </div>

    </div>
  );
}