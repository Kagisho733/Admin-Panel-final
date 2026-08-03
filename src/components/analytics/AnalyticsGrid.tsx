interface Props {

  children: React.ReactNode;

}

export default function AnalyticsGrid({

  children,

}: Props) {

  return (

    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >

      {children}

    </div>

  );

}