import { spawn } from "child_process";
import path from "path";

export function executePythonScript(
  scriptName: string,
  filePath: string,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(`../python/${scriptName}.py`);

    const pythonProcess = spawn("python", [scriptPath, filePath]);

    let output = "";
    let errorOutput = "";

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
