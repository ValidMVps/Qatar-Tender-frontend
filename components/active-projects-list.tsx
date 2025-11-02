"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useTranslation from "@/lib/hooks/useTranslation";

interface Project {
  id: string;
  title: string;
  clientName?: string; // For service provider
  bidderName?: string; // For project poster
  status: string;
  lastMessageTime: string;
  unreadMessages: number;
}

interface ActiveProjectsListProps {
  projects: Project[];
  chatBasePath: string;
  role: "poster" | "provider";
}

export function ActiveProjectsList({
  projects,
  chatBasePath,
  role,
}: ActiveProjectsListProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      {projects.length === 0 ? (
        <Card className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("no_active_projects")}
          </h3>
          <p className="text-gray-600 mb-6">
            You don't have any active projects with ongoing chats at the moment.
          </p>
          {role === "poster" && (
            <Link href="/create-tender">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                {t("post_a_new_tender")}
              </Button>
            </Link>
          )}
          {role === "provider" && (
            <Link href="/business-dashboard/service-providing/browse">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                {t("browse_opportunities")}
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">
                <Link
                  href={`${chatBasePath}/${project.id}`}
                  className="hover:underline"
                >
                  {project.title}
                </Link>
              </CardTitle>
              <Badge variant="secondary">{project.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder-user.jpg"
                    alt={
                      role === "poster"
                        ? project.bidderName
                        : project.clientName
                    }
                  />
                  <AvatarFallback>
                    {(role === "poster"
                      ? project.bidderName
                      : project.clientName
                    )?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-gray-700">
                  {role === "poster"
                    ? `Chat with ${project.bidderName}`
                    : `Chat with ${project.clientName}`}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last message: {project.lastMessageTime}
                </span>
                {project.unreadMessages > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {project.unreadMessages} New Message
                    {project.unreadMessages > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <Link href={`${chatBasePath}/${project.id}`}>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t("open_chat")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
