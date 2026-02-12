import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Project = {
  title: string;
  timeframe: string;
  description: string;
  bullets: string[];
  tags: string[];
  github?: string;
  live?: string;
};

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      title: 'Developer WorkFlow Discipline',
      timeframe: 'Jan 2023 – Apr 2023',
      description: 'FastAPI system to categorize developers by Git activity and reduce manager investigation time.',
      bullets: [
        'Designed FastAPI-based pipeline for activity classification and reporting.',
        'Used Pydantic validation and MVC structure for maintainability.',
        'Achieved ~96% unit test coverage using Pytest.'
      ],
      tags: ['Python', 'FastAPI', 'Pytest', 'Pydantic'],
      github: 'https://github.com/rishikeshmanohar/Developer-WorkFlow-Discipline'
    },
    {
      title: 'Online Pharmacy System',
      timeframe: 'Jan 2024 – Mar 2024',
      description: 'Full-stack ordering platform with tracking and delivery routing features.',
      bullets: [
        'Built ordering and live tracking experience with authentication and verification.',
        'Integrated Google Maps for delivery routing and improved UX for delivery flow.'
      ],
      tags: ['Full-stack', 'APIs', 'Maps Integration'],
      github: 'https://github.com/rishikeshmanohar/medicare-plus-ecommerce'
    },
    {
      title: 'Personal Portfolio',
      timeframe: 'Jun 2024 – Nov 2024',
      description: 'Responsive portfolio hosted on GitHub Pages with contact form and project showcase.',
      bullets: [
        'Designed responsive UI and project showcase sections.',
        'Hosted on GitHub Pages with contact form integration.'
      ],
      tags: ['Angular', 'TypeScript', 'UI/UX'],
      live: 'https://rishikeshmanohar.github.io/My-Portfolio/'
    }
  ];
}
