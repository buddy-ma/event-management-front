"use client";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Laugh } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const HeroSection = () => {
  const router = useRouter();
  const { status } = useSession();

  const handleOrganizeEvent = () => {
    if (status === "authenticated") {
      router.push("/events/create");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="container w-full relative">
      {/* Gradient */}

      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl -z-10" />
      <div className="grid place-items-center md:place-items-left lg:max-w-screen-xl gap-8 mx-auto md:mx-20 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-left space-y-8">
            <Badge variant="default" className="text-sm py-2 px-4 bg-primary">
              <span className="mr-2 text-muted">
                <Laugh color="#9cc15c" />
              </span>
              <span className="text-secondary">Event management app</span>
            </Badge>

            <div className="text-center md:text-left text-4xl md:text-5xl font-bold">
              <h1 className="text-black dark:text-white">
                <span className="text-transparent bg-primary bg-clip-text">
                  Connect, Create,
                </span>
                <br />
                <span className="text-transparent bg-secondary bg-clip-text">
                  Celebrate Together.
                </span>
              </h1>
            </div>
            <p className="text-muted-foreground text-xl text-gray-900 mt-2 space-y-1">
              Join our community to discover and organize amazing events.
              Whether you're hosting or participating, make every moment count.
            </p>

            <div className="md:space-x-4">
              <Button
                onClick={handleOrganizeEvent}
                className="w-auto group/arrow"
              >
                Organize an event
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Button>
              <Button className="w-auto bg-secondary text-primary font-bold hover:bg-primary hover:text-secondary">
                Join an event
              </Button>
            </div>
          </div>

          <div>
            <Image
              width={500}
              height={500}
              className="mx-auto rounded-lg relative rouded-lg leading-none flex items-center border-none"
              src={"/EMS.png"}
              alt="dashboard"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
