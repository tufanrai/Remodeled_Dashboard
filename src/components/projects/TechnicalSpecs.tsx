import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TechnicalSpecsData {
  projectType: string;
  headHeight: string;
  turbineType: string;
  annualGeneration: string;
  gridConnection: string;
}

interface TechnicalSpecsProps {
  specs: TechnicalSpecsData;
  onChange: (specs: TechnicalSpecsData) => void;
}

const projectTypes = ["Run-of-River", "Storage", "Pumped Storage", "Micro Hydro", "Mini Hydro"];
const turbineTypes = ["Francis", "Pelton", "Kaplan", "Crossflow", "Turgo"];

export function TechnicalSpecs({ specs, onChange }: TechnicalSpecsProps) {
  const updateSpec = (key: keyof TechnicalSpecsData, value: string) => {
    onChange({ ...specs, [key]: value });
  };

  return (
    <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
      <h3 className="font-semibold text-sm text-foreground">Technical Specifications</h3>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="projectType">Project Type</Label>
          <Select value={specs.projectType} onValueChange={(v) => updateSpec("projectType", v)}>
            <SelectTrigger className="bg-muted/30">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-card border shadow-lg">
              {projectTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, "-")}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="headHeight">Head Height (m)</Label>
          <Input
            id="headHeight"
            type="number"
            placeholder="e.g., 150"
            value={specs.headHeight}
            onChange={(e) => updateSpec("headHeight", e.target.value)}
            className="bg-muted/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="turbineType">Turbine Type</Label>
          <Select value={specs.turbineType} onValueChange={(v) => updateSpec("turbineType", v)}>
            <SelectTrigger className="bg-muted/30">
              <SelectValue placeholder="Select turbine" />
            </SelectTrigger>
            <SelectContent className="bg-card border shadow-lg">
              {turbineTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="annualGeneration">Annual Generation (GWh)</Label>
          <Input
            id="annualGeneration"
            type="number"
            placeholder="e.g., 250"
            value={specs.annualGeneration}
            onChange={(e) => updateSpec("annualGeneration", e.target.value)}
            className="bg-muted/30"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="gridConnection">Grid Connection</Label>
          <Input
            id="gridConnection"
            placeholder="e.g., 132kV transmission line to national grid"
            value={specs.gridConnection}
            onChange={(e) => updateSpec("gridConnection", e.target.value)}
            className="bg-muted/30"
          />
        </div>
      </div>
    </div>
  );
}
