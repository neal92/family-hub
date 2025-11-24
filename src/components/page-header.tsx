import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8", className)}>
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight font-headline text-gray-800 dark:text-gray-100">{title}</h1>
        {description && <p className="text-muted-foreground max-w-prose">{description}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
