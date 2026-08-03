interface Props {

  title: string;

  value: string | number;

  subtitle?: string;

}

export default function AnalyticsCard({

  title,

  value,

  subtitle,

}: Props) {

  return (

    <div
      className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
      "
    >

      <p className="text-sm text-gray-500">

        {title}

      </p>

      <h2 className="mt-3 text-3xl font-bold">

        {value}

      </h2>

      {subtitle && (

        <p className="mt-2 text-sm text-gray-400">

          {subtitle}

        </p>

      )}

    </div>

  );

}