import { Button, Dropdown, Tag, Input, Avatar, Tooltip } from "antd";
import { CloseOutlined, FilterOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { ChangeRequest } from "@/lib/types";

type ActorType = "customer" | "pm" | "admin";

export interface FilterOptions {
  actors?: string[];
  priorities?: string[];
  sortBy?: string;
}

interface CrFilterBarProps {
  data?: ChangeRequest[];
  onFiltersChange?: (filters: FilterOptions) => void;
  onClearAll?: () => void;
  activeFilters?: FilterOptions;
  onSearchChange?: (searchText: string) => void;
  searchText?: string;
  actorType?: ActorType;
}

const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const SORT_OPTIONS = [
  { label: "Latest Updated", value: "latest" },
  { label: "Oldest Updated", value: "oldest" },
  { label: "Most Recent", value: "recent" },
];

// Color palette for avatars
const AVATAR_COLORS = [
  "#f56a00",
  "#7265e6",
  "#ffbf00",
  "#00a2ae",
  "#52c41a",
  "#eb2f96",
  "#1890ff",
  "#faad14",
];

const getInitials = (fullName: string): string => {
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (index: number): string => {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
};

/**
 * Shared CR Filter Bar Component
 * Used by Customer, PM, and Admin actors
 */
export const CrFilterBar: React.FC<CrFilterBarProps> = ({
  data = [],
  onFiltersChange,
  onClearAll,
  activeFilters = {},
  onSearchChange,
  searchText = "",
}) => {
  const [selectedActors, setSelectedActors] = useState<string[]>(
    activeFilters.actors || []
  );
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    activeFilters.priorities || []
  );
  const [selectedSort, setSelectedSort] = useState<string>(
    activeFilters.sortBy || "latest"
  );

  // Extract unique actors from data
  const uniqueActors = useMemo(() => {
    const actorsMap = new Map();
    data.forEach((cr) => {
      if (cr.createdBy) {
        const userId = cr.createdBy.id;
        if (!actorsMap.has(userId)) {
          actorsMap.set(userId, {
            id: userId,
            fullName: cr.createdBy.fullName,
            email: cr.createdBy.email,
            color: getAvatarColor(actorsMap.size),
            index: actorsMap.size,
          });
        }
      }
    });
    return Array.from(actorsMap.values());
  }, [data]);

  const handleActorChange = (actorId: string) => {
    const updated = selectedActors.includes(actorId)
      ? selectedActors.filter((a) => a !== actorId)
      : [...selectedActors, actorId];
    setSelectedActors(updated);
    onFiltersChange?.({ ...activeFilters, actors: updated });
  };

  const handlePriorityChange = (priority: string) => {
    const updated = selectedPriorities.includes(priority)
      ? selectedPriorities.filter((p) => p !== priority)
      : [...selectedPriorities, priority];
    setSelectedPriorities(updated);
    onFiltersChange?.({ ...activeFilters, priorities: updated });
  };

  const handleSortChange = (sortValue: string) => {
    setSelectedSort(sortValue);
    onFiltersChange?.({ ...activeFilters, sortBy: sortValue });
  };

  const handleClearAll = () => {
    setSelectedActors([]);
    setSelectedPriorities([]);
    setSelectedSort("latest");
    onClearAll?.();
  };

  const filterMenu = {
    items: [
      {
        label: (
          <div className="w-80 space-y-4 p-2">
            {/* Priority Filter */}
            <div>
              <div className="font-medium text-sm text-gray-700 mb-2">
                Priority
              </div>
              <div className="space-y-2">
                {PRIORITIES.map((priority) => (
                  <label
                    key={priority}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPriorities.includes(
                        priority.toLowerCase()
                      )}
                      onChange={() =>
                        handlePriorityChange(priority.toLowerCase())
                      }
                      className="cursor-pointer"
                    />
                    <span className="text-sm">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="border-t pt-2">
              <div className="font-medium text-sm text-gray-700 mb-2">
                Sort By
              </div>
              <div className="space-y-2">
                {SORT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  >
                    <input
                      type="radio"
                      name="sort"
                      checked={selectedSort === option.value}
                      onChange={() => handleSortChange(option.value)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ),
        key: "filters",
      },
    ],
  };

  const hasActiveFilters =
    selectedActors.length > 0 ||
    selectedPriorities.length > 0 ||
    selectedSort !== "latest";

  const displayedActorsCount = Math.min(4, uniqueActors.length);
  const remainingActorsCount = uniqueActors.length - displayedActorsCount;

  return (
    <div className="space-y-3">
      {/* Search Input & Actor Avatars & Filter Button */}
      <div className="flex items-center gap-4 p-3 rounded-lg border-2 border-red-400 bg-white w-fit">
        <Input
          placeholder="Search"
          value={searchText}
          onChange={(e) => onSearchChange?.(e.target.value)}
          prefix={<span className="text-gray-400">🔍</span>}
          className="w-48"
          variant="borderless"
          style={{ fontSize: "14px" }}
        />

        {/* Actor Avatars */}
        {uniqueActors.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center -space-x-2">
              {uniqueActors.slice(0, displayedActorsCount).map((actor) => (
                <Tooltip key={actor.id} title={actor.fullName}>
                  <Avatar
                    size={28}
                    style={{
                      backgroundColor: selectedActors.includes(actor.id)
                        ? actor.color
                        : "#d9d9d9",
                      cursor: "pointer",
                      border: selectedActors.includes(actor.id)
                        ? "2px solid #1890ff"
                        : "none",
                    }}
                    onClick={() => handleActorChange(actor.id)}
                  >
                    {getInitials(actor.fullName)}
                  </Avatar>
                </Tooltip>
              ))}
              {remainingActorsCount > 0 && (
                <Tooltip title={`+${remainingActorsCount} more`}>
                  <Avatar
                    size={28}
                    style={{
                      backgroundColor: "#f0f0f0",
                      color: "#666",
                      cursor: "pointer",
                      border: "1px solid #d9d9d9",
                      fontSize: "12px",
                    }}
                  >
                    +{remainingActorsCount}
                  </Avatar>
                </Tooltip>
              )}
            </div>
          </div>
        )}

        {/* Filter Button */}
        <Dropdown menu={filterMenu} trigger={["click"]} placement="bottomRight">
          <Button
            size="small"
            icon={<FilterOutlined />}
            type={hasActiveFilters ? "primary" : "default"}
          >
            Filter
          </Button>
        </Dropdown>

        {hasActiveFilters && (
          <Button
            size="small"
            type="text"
            danger
            onClick={handleClearAll}
            icon={<CloseOutlined />}
          />
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap px-4">
          {selectedActors.map((actorId) => {
            const actor = uniqueActors.find((a) => a.id === actorId);
            return (
              <Tag
                key={actorId}
                closable
                onClose={() => handleActorChange(actorId)}
                icon={
                  <Avatar
                    size="small"
                    style={{ backgroundColor: actor?.color }}
                  >
                    {getInitials(actor?.fullName || "")}
                  </Avatar>
                }
                className="text-xs"
              >
                {actor?.fullName}
              </Tag>
            );
          })}
          {selectedPriorities.map((priority) => (
            <Tag
              key={priority}
              closable
              onClose={() => handlePriorityChange(priority)}
              className="text-xs"
            >
              {priority}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};
