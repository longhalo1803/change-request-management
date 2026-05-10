import { useTranslation } from "@/hooks/useTranslation";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "medium",
  showSubtitle = true,
  className = "",
}) => {
  const { t } = useTranslation("dashboard");

  const sizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl",
  };

  const iconSizes = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${iconSizes[size]} bg-white rounded-xl flex items-center justify-center flex-shrink-0`}
      >
        <span
          style={{
            fontSize: size === "small" ? 20 : size === "medium" ? 24 : 28,
            color: "#0052CC",
          }}
        >
          ✦
        </span>
      </div>

      <div className="flex flex-col">
        <span
          className={`${sizeClasses[size]} font-bold text-gray-900 leading-tight`}
        >
          {t("sidebar.app_name")}
        </span>
        {showSubtitle && (
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {t("sidebar.app_subtitle")}
          </span>
        )}
      </div>
    </div>
  );
};
