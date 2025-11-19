import { z } from "zod";

export const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, { message: "Your password must be at least 8 characters long" })
    .max(64, { message: "Your password cannot be longer than 64 characters" }),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[0-9]+$/, "Phone number must be numeric"),
  college_name: z.string().min(1, "College name is required"),
  branch: z.string().min(1, "Branch is required"),
  year_of_study: z
    .number()
    .min(1, "Year of study must be numeric")
    .max(5, "Year of study must be between 1 and 5"),
  cl_code: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^CL-\d{6}-[A-Z0-9]{6}$/.test(val),
      "Invalid CL code format (e.g., CL-202507-HMJPYT)"
    ),
});

export const CLRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, { message: "Your password must be at least 8 characters long" })
    .max(64, { message: "Your password cannot be longer than 64 characters" }),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[0-9]+$/, "Phone number must be numeric"),
  college_name: z.string().min(1, "College name is required"),
  branch: z.string().min(1, "Branch is required"),
  year_of_study: z
    .number()
    .min(1, "Year of study must be numeric")
    .max(5, "Year of study must be between 1 and 5"),
});

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, { message: "Your password must be at least 8 characters long" })
    .max(64, { message: "Your password cannot be longer than 64 characters" }),
});

export const PasswordRequestSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const ResetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, { message: "Your password must be at least 8 characters long" })
      .max(64, {
        message: "Your password cannot be longer than 64 characters",
      }),
    confirm_new_password: z
      .string()
      .min(8, { message: "Your password must be at least 8 characters long" })
      .max(64, {
        message: "Your password cannot be longer than 64 characters",
      }),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    path: ["confirm_new_password"],
    message: "Passwords do not match",
  });

export const ChangePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(8, { message: "Your password must be at least 8 characters long" })
      .max(64, {
        message: "Your password cannot be longer than 64 characters",
      }),
    new_password: z
      .string()
      .min(8, { message: "Your password must be at least 8 characters long" })
      .max(64, {
        message: "Your password cannot be longer than 64 characters",
      }),
    confirm_new_password: z
      .string()
      .min(8, { message: "Your password must be at least 8 characters long" })
      .max(64, {
        message: "Your password cannot be longer than 64 characters",
      }),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  });

export const UpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .optional(),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[0-9]+$/, "Phone number must be numeric"),
  college_name: z.string().min(1, "College name is required").optional(),
  branch: z.string().min(1, "Branch is required"),
  year_of_study: z
    .number()
    .min(1, "Year of study must be numeric")
    .max(5, "Year of study must be between 1 and 5"),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[0-9]+$/, "Phone number must be numeric"),
});

export const teamRegistrationSchema = z.object({
  is_team_event: z.literal(true),
  teamName: z.string().min(1, "Team name is required"),
  teamMembers: z
    .array(teamMemberSchema)
    .min(0) // allow empty (solo registration inside team event)
    .optional(),
});

export const soloRegistrationSchema = z.object({
  is_team_event: z.literal(false),
});

export const registrationSchema = z.discriminatedUnion("is_team_event", [
  teamRegistrationSchema,
  soloRegistrationSchema,
]);

export const createEventSchema = z
  .object({
    name: z.string().min(1, "Event name is required").max(100),
    description: z.string().min(1, "Description is required").max(1000),
    category: z.string().min(1, "Category is required"),

    start_date: z.coerce.string().min(1, "Start date is required"),
    start_time: z.coerce.string().min(1, "Start time is required"),
    end_date: z.coerce.string().min(1, "End date is required"),
    end_time: z.coerce.string().min(1, "End time is required"),

    venue: z.string().min(1, "Venue is required"),
    max_capacity: z.number().min(1).max(10000),
    is_team_event: z.boolean(),

    team_size_min: z.number().min(1).optional(),
    team_size_max: z.number().min(1).optional(),

    rules: z.string().optional(),
    contact_email: z.string().email("Invalid email"),
    contact_phone: z.string().min(10).max(15),

    registration_deadline_date: z.coerce
      .string()
      .min(1, "Deadline date required"),
    registration_deadline_time: z.coerce
      .string()
      .min(1, "Deadline time required"),

    banner_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      const start = new Date(`${data.start_date}T${data.start_time}`);
      const end = new Date(`${data.end_date}T${data.end_time}`);
      return end > start;
    },
    { message: "End time must be after start time", path: ["end_time"] }
  )
  .refine(
    (data) => {
      const start = new Date(`${data.start_date}T${data.start_time}`);
      const deadline = new Date(
        `${data.registration_deadline_date}T${data.registration_deadline_time}`
      );
      return deadline < start;
    },
    {
      message: "Registration deadline must be before event start",
      path: ["registration_deadline_time"],
    }
  )
  .refine(
    (data) => {
      if (data.is_team_event && data.team_size_min && data.team_size_max) {
        return data.team_size_max >= data.team_size_min;
      }
      return true;
    },
    {
      message:
        "Maximum team size must be greater than or equal to minimum team size",
      path: ["team_size_max"],
    }
  )
  .refine(
    (data) => {
      if (data.is_team_event) {
        return (
          data.team_size_min !== undefined && data.team_size_max !== undefined
        );
      }
      return true;
    },
    {
      message: "Team size fields are required when event is a team event",
      path: ["team_size_min"],
    }
  );

export const updateEventSchema = z
  .object({
    name: z.string().max(100).optional(),
    description: z.string().max(1000).optional(),
    category: z.string().optional(),

    start_date: z.coerce.string().optional(),
    start_time: z.coerce.string().optional(),
    end_date: z.coerce.string().optional(),
    end_time: z.coerce.string().optional(),

    venue: z.string().optional(),
    max_capacity: z.number().min(1).max(10000).optional(),
    is_team_event: z.boolean().optional(),

    team_size_min: z.number().min(1).optional(),
    team_size_max: z.number().min(1).optional(),

    rules: z.string().optional(),
    contact_email: z.string().email("Invalid email").optional(),
    contact_phone: z.string().min(10).max(15).optional(),

    registration_deadline_date: z.coerce.string().optional(),
    registration_deadline_time: z.coerce.string().optional(),

    banner_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  })
  // Check: end must be after start if both are present
  .refine(
    (data) => {
      if (
        data.start_date &&
        data.start_time &&
        data.end_date &&
        data.end_time
      ) {
        const start = new Date(`${data.start_date}T${data.start_time}`);
        const end = new Date(`${data.end_date}T${data.end_time}`);
        return end > start;
      }
      return true;
    },
    { message: "End time must be after start time", path: ["end_time"] }
  )
  // Check: deadline must be before start if all provided
  .refine(
    (data) => {
      if (
        data.start_date &&
        data.start_time &&
        data.registration_deadline_date &&
        data.registration_deadline_time
      ) {
        const start = new Date(`${data.start_date}T${data.start_time}`);
        const deadline = new Date(
          `${data.registration_deadline_date}T${data.registration_deadline_time}`
        );
        return deadline < start;
      }
      return true;
    },
    {
      message: "Registration deadline must be before event start",
      path: ["registration_deadline_time"],
    }
  )
  // Check: team size relation
  .refine(
    (data) => {
      if (data.is_team_event && data.team_size_min && data.team_size_max) {
        return data.team_size_max >= data.team_size_min;
      }
      return true;
    },
    {
      message:
        "Maximum team size must be greater than or equal to minimum team size",
      path: ["team_size_max"],
    }
  )
  // Check: require team sizes if is_team_event is true
  .refine(
    (data) => {
      if (data.is_team_event) {
        return (
          data.team_size_min !== undefined && data.team_size_max !== undefined
        );
      }
      return true;
    },
    {
      message: "Team size fields are required when event is a team event",
      path: ["team_size_min"],
    }
  );
