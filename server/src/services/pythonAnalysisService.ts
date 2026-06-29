import { spawn } from "child_process";
import path from "path";

export function executePythonScript(
  scriptName: string,
  filePath: string,
  columnTypes?: Record<string, string>,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(`../python/${scriptName}.py`);

    let output = "";
    let errorOutput = "";

    const args = [scriptPath, filePath];
    if (columnTypes) {
      args.push(JSON.stringify(columnTypes));
    }

    const pythonExecutable =
      process.platform === "win32" ? "python" : "python3";
    const pythonProcess = spawn(pythonExecutable, args);

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(`Python script failed with code ${code}: ${errorOutput}`),
        );
      }

      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch {
        reject(new Error(`Failed to parse Python output: ${output}`));
      }
    });
  });
}
