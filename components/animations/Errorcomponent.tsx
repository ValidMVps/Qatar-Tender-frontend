import { Button } from "@/components/ui/button";

const Error = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 ">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <h2 className="mb-6 text-5xl font-semibold">Whoops!</h2>
        <h3 className="mb-1.5 text-3xl font-semibold">Something went wrong</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          The page you&apos;re looking for isn&apos;t found, we suggest you back
          to home.
        </p>
        <Button asChild size="lg" className="rounded-lg text-base shadow-sm">
          <a href="/">Back to home page</a>
        </Button>
      </div>

      {/* Right Section: Illustration */}
    </div>
  );
};

export default Error;
