import CtaInput from "@/components/pages/index/CtaInput";
import Feature from "@/components/pages/index/Feature";
import Stars from "@/components/pages/index/Stars";
import Stat from "@/components/pages/index/Stat";
import config from "@/config";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>{config.site.seo.homepage.title}</title>
        <meta
          name="description"
          content={config.site.seo.homepage.description}
        />
      </Head>
      <div>
        <header className="-mt-16 w-full bg-primary-light py-16 md:py-32">
          <div className="mx-auto max-w-4xl space-y-8">
            <h1 className="text-center text-5xl font-semibold sm:text-6xl  md:text-8xl">
              Not verme sırası artık sende{" "}
              <span>
                <Stars />
              </span>
            </h1>
            <h2 className="text-center text-2xl font-medium md:text-4xl">
              Öğretmenlerini ve üniversiteni puanla
            </h2>
            <CtaInput
              className="mx-auto max-w-xl"
              placeholder="Öğretmenini veya üniversiteni ara"
            />
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
          <div className="my-4">{/* TODO: Ad */}</div>
          {config.landing.features.map((feature, idx) => (
            <Feature
              key={feature.title}
              flip={idx % 2 === 1}
              leftSide={{
                title: feature.title,
                subtitle: feature.subtitle,
                image: feature.bgImage,
              }}
              rightSide={<div></div>}
              color={feature.color}
            />
          ))}
          <div className="my-4">{/* TODO: Ad */}</div>
        </section>
        <section className="-mb-12"></section>
      </div>
    </>
  );
}
