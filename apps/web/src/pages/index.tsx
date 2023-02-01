import Feature from "@/components/pages/index/Feature";
import Stars from "@/components/pages/index/Stars";
import Stat from "@/components/pages/index/Stat";
import config from "@/config";

export default function Page() {
  return (
    <div>
      <header className="bg-primary-light -mt-16 w-full py-16 md:py-32">
        <div className="mx-auto max-w-4xl space-y-8">
          <h1 className="text-center text-5xl font-semibold sm:text-6xl  md:text-8xl">
            Not verme{" "}
            <span>
              <Stars />
            </span>{" "}
            sırası artık sende
          </h1>
          <h2 className="text-center text-2xl font-medium md:text-4xl">
            Öğretmenlerini ve üniversiteni puanla
          </h2>
        </div>
      </header>
      <section className="bg-black py-8 md:py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          {config.landing.stats.map((stat) => (
            <Stat key={stat.text} {...stat} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl">
        {config.landing.features.map((feature, idx) => (
          <Feature
            key={feature.title}
            flip={idx % 2 === 1}
            leftSide={{
              title: feature.title,
              subtitle: feature.subtitle,
            }}
            rightSide={<div>{/* TODO: We should put image here */}</div>}
            color={feature.color}
          />
        ))}
      </section>
      <section className="-mb-16"></section>
    </div>
  );
}
