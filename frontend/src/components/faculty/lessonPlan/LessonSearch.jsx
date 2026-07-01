import {
  FiSearch,
  FiFilter,
} from "react-icons/fi";

export default function LessonSearch({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "22px",
        marginBottom: "30px",
        boxShadow:
          "0 10px 30px rgba(15,23,42,.05)",
        border: "1px solid #EEF2F7",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}

        <div
          style={{
            flex: 1,
            minWidth: "280px",
            display: "flex",
            alignItems: "center",
            background: "#F8FAFC",
            borderRadius: "14px",
            padding: "0 18px",
            height: "54px",
          }}
        >
          <FiSearch
            color="#94A3B8"
            size={20}
          />

          <input
            value={search}
            onChange={(e) =>
              onSearchChange(
                e.target.value
              )
            }
            placeholder="Search lesson plans..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              marginLeft: "12px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Status */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FiFilter
            color="#64748B"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(
                e.target.value
              )
            }
            style={{
              height: "54px",
              borderRadius: "14px",
              border:
                "1px solid #E2E8F0",
              padding: "0 18px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="all">
              All Plans
            </option>

            <option value="active">
              Active
            </option>

            <option value="draft">
              Draft
            </option>

            <option value="scheduled">
              Scheduled
            </option>
          </select>
        </div>

        {/* Week */}

        <select
          style={{
            height: "54px",
            borderRadius: "14px",
            border:
              "1px solid #E2E8F0",
            padding: "0 18px",
          }}
        >
          <option>
            All Weeks
          </option>

          <option>
            Week 1
          </option>

          <option>
            Week 2
          </option>

          <option>
            Week 3
          </option>

          <option>
            Week 4
          </option>

          <option>
            Week 5
          </option>

          <option>
            Week 6
          </option>

          <option>
            Week 7
          </option>

          <option>
            Week 8
          </option>
        </select>

        {/* Sort */}

        <select
          style={{
            height: "54px",
            borderRadius: "14px",
            border:
              "1px solid #E2E8F0",
            padding: "0 18px",
          }}
        >
          <option>
            Latest
          </option>

          <option>
            Oldest
          </option>

          <option>
            Alphabetical
          </option>
        </select>
      </div>
    </div>
  );
}