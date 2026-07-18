import { revalidatePath } from "next/cache";
import { getSettings, putSettings } from "@/lib/alfred-api";
import { problemMessage } from "../ui";

export const metadata = { title: "Settings — Alfred" };

/**
 * Custom instructions are injected into every agent run for this tenant, e.g.
 * "our API returns snake_case" or "never edit migrations". Writes require an
 * admin/owner role; the API returns 403 for members.
 */
async function saveInstructions(formData: FormData) {
  "use server";
  const text = String(formData.get("custom_instructions") ?? "");
  await putSettings({ custom_instructions: text });
  revalidatePath("/dashboard/settings");
}

export default async function SettingsPage() {
  let settings: Record<string, unknown> = {};
  let problem: string | null = null;

  try {
    settings = await getSettings();
  } catch (error) {
    problem = problemMessage(error);
  }

  const instructions =
    typeof settings.custom_instructions === "string" ? settings.custom_instructions : "";

  return (
    <>
      <h1 className="dash-h1">Settings</h1>
      <p className="dash-sub">How Alfred behaves on your codebase.</p>

      {problem ? (
        <div className="notice">{problem}</div>
      ) : (
        <>
          <h2 className="dash-h2">Custom instructions</h2>
          <form action={saveInstructions}>
            <textarea
              className="dash-field"
              name="custom_instructions"
              defaultValue={instructions}
              placeholder={'e.g. "Our API returns snake_case." / "Never edit migrations."'}
            />
            <button className="dash-btn" type="submit">
              Save
            </button>
          </form>

          <h2 className="dash-h2">All settings</h2>
          {Object.keys(settings).length === 0 ? (
            <p className="dash-sub">No settings stored yet.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(settings).map(([key, value]) => (
                  <tr key={key}>
                    <td className="mono">{key}</td>
                    <td className="mono">{JSON.stringify(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  );
}
